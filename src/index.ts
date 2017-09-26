import {sync as globSync} from 'glob';
import {toPairs, map, each, includes, fromPairs, without} from 'lodash';
import outdent from 'outdent';
import * as assert from 'assert';
import * as request from 'request-promise';
import { normalizeUrl, template as t, prettyPrintTs, log, Cache, JQueryFactory, writeFile, readJsonFile, writeJsonFile } from './utils';
import {each as asyncEach} from 'bluebird';
import { JSDOM } from 'jsdom';
import { SpecFile, SpecType, SpecProperty } from './spec-file';

const paths = {
    generatedDeclaration: 'generated-declarations/aws-cloudformation.ts',
    docsCache: 'cache/html-docs.json',
    specificationsDirectory: 'specifications'
};

async function main() {
    const rootNamespace = new Namespace();

    const specs: {[path: string]: SpecFile} = Object.create(null);

    /** Cache of parsed HTML documentation with JQuery instances, stored by URL. */
    const parsedDocs = new (class extends Cache<string, {$: JQueryStatic, window: Window}> {
        maxItems = 30;
        dispose(v, k) {
            v.window.close();
        }
        createItem(k, ck) {
            const window = new JSDOM(docs[ck]).window;
            const $ = JQueryFactory(window);
            return {$, window};
        }
    });
    /** Get a JQuery object for the given documentation URL */
    function get$(url: string) { return parsedDocs.getOrCreate(url).$; }

    const docs: {[url: string]: string} = Object.create(null);
    // Pull docs from filesystem cache to avoid re-downloading all of them again.
    Object.assign(docs, readJsonFile(paths.docsCache));

    // Load all AWS specs into memory
    globSync('**.json', {cwd: paths.specificationsDirectory}).map(path => {
        specs[path] = readJsonFile(`specifications/${ path }`);
    });

    try {
        await asyncEach(toPairs(specs), async ([path, spec]) => {
            await asyncEach([
                ...toPairs(spec.PropertyTypes),
                ...toPairs(spec.ResourceType)
            ], cb);
            async function cb([name, type]: [string, SpecType]) {
                createType(name);
                await fetchDocs(type.Documentation);
                asyncEach(toPairs(type.Properties), async ([propName, prop]: [string, SpecProperty]) => {
                    await fetchDocs(prop.Documentation);
                });
            }
            function createType(name: string) {
                rootNamespace.getOrCreateChildType(name);
            }
            async function fetchDocs(url: string) {
                const actualUrl = normalizeUrl(url);
                if(typeof docs[actualUrl] === 'string') {
                    return;
                }
                console.log(`Downloading ${ url }`);
                docs[actualUrl] = await request(actualUrl);
            }
        });
    } finally {
        // Save documentation cache back to disc
        writeJsonFile(paths.docsCache, docs);
    }

    /** Generated type declaration .ts */
    const declaration = t `
    type TODO = any;
    type CFString = string;
    type CFBoolean = boolean;
    type CFInteger = number;
    type CFDouble = number;
    type CFLong = number;
    type CFTimestamp = string; // TODO
    type CFJson = object; // TODO
    type CFList<T> = Array<T>;
    type CFMap<T> = Map<string, T>;

    ${
        map(specs, (spec, path) => {
            const specJson: SpecFile = readJsonFile(`specifications/${ path }`);

            return t`
                ${ map(specJson.ResourceType, renderType) }
                ${ map(specJson.PropertyTypes, renderType) }
            `;

            function renderType(v: SpecType, k: string) {
                const nameParts = k.split(/::|\./);
                const namespace = nameParts.slice(0, -1).join('.');
                const name = nameParts[nameParts.length - 1];
                const fullName = namespace ? `${ namespace }.${ name }` : `${ name }`;

                const $ = get$(v.Documentation);

                log(`Generating declaration for ${ fullName }...`);
                return t `
                    ${ namespace && `export namespace ${ namespace } {` }
                        /**
                         * ${ $('.topictitle+p').text() }
                         * 
                         * Documentation: ${ v.Documentation }
                         */
                        export interface ${ name } {
                            ${
                                map(v.Properties, (prop, propName) => {
                                    const $dt = $('.variablelist>dl>dt').filter((i, e) => $(e).text() === propName);
                                    const $dd = $dt.find('+*');
                                    return t `
                                        /**
                                         * ${ $dd.find('>p').eq(0).text() }
                                         * 
                                         * Documentation: ${ prop.Documentation }
                                         * UpdateType: ${ prop.UpdateType }
                                         */
                                        ${ propName }${!prop.Required && '?'}: ${ renderTypeString(prop, rootNamespace.getOrCreateChildNamespace(fullName)) };

                                    `;
                                })
                            }
                        }
                    ${ namespace && `}` }
                `;
            }
        })
    }`;

    function parseTypeName(fullName: string) {
        const nameParts = fullName.split(/::|\./);
        let namespace: string | undefined = nameParts.slice(0, -1).join('.');
        if(namespace === '') namespace = undefined;
        const name = nameParts[nameParts.length - 1];
        return {namespace, name};
    }

    function renderTypeString(prop: SpecProperty, relativeTo: Namespace): string {
        if(prop.PrimitiveType) {
            return renderPrimitiveType(prop.PrimitiveType);
        }
        if(prop.Type) {
            if(prop.PrimitiveItemType) {
                return `${ renderPropertyType(prop.Type, relativeTo) }<${ renderPrimitiveType(prop.PrimitiveItemType) }>`;
            } else if(prop.ItemType) {
                return `${ renderPropertyType(prop.Type, relativeTo) }<${ renderPropertyType(prop.ItemType, relativeTo) }>`;
            } else {
                return `${ renderPropertyType(prop.Type, relativeTo) }`;
            }
        }
        throw new Error('Unexpected property');
    }
    function renderPrimitiveType(prim: string): string {
        return `CF${ prim }`;
    }
    function renderPropertyType(findName: string, relativeTo: Namespace): string {
        if(includes(['Map', 'List'], findName)) return `CF${ findName }`;
        const ret = relativeTo.resolveType(findName)!.fullName();
        assert(typeof ret === 'string');
        return ret!;
    }

    writeFile(paths.generatedDeclaration, prettyPrintTs(declaration));
}

class Shared {
    constructor(name?: string, parent?: Namespace) {
        name != null && (this.name = name);
        parent != null && (this._parent = parent);
    }
    _parent: Namespace | null = null;
    name: string | null = null;
    fullName(): string | null {
        const parentName = this._parent ? this._parent.fullName() : null;
        return parentName ? `${ parentName }.${ this.name }` : this.name;
    }
    _splitPath(s: string): Array<string> {
        return s.split(/::|\./);
    }
    toJSON() {
        return Object.assign({}, this, {_parent: undefined});
    }
}
/** Represents an AWS "Type" in the CloudFormation schema (e.g. AWS::ApiGateway::Account) */
class Type extends Shared {
}
/** Represents an AWS "Namespace" in the Cloudformation schema (e.g. AWS::ApiGateway) */
class Namespace extends Shared {
    _namespaces = new Map<string, Namespace>();
    _types = new Map<string, Type>();
    _parent: Namespace | null;
    getOrCreateChildType(awsFullName: string | Array<string>): Type {
        if(typeof awsFullName === 'string') awsFullName = this._splitPath(awsFullName);
        if(awsFullName.length === 1) {
            let type = this._types.get(awsFullName[0]);
            if(!type) {
                type = new Type(awsFullName[0], this);
                this._types.set(awsFullName[0], type);
            }
            return type;
        } else {
            return this.getOrCreateChildNamespace(awsFullName.slice(0, -1)).getOrCreateChildType(awsFullName.slice(-1));
        }
    }
    getType(awsFullName: string | Array<string>): Type | null {
        if(typeof awsFullName === 'string') awsFullName = this._splitPath(awsFullName);
        if(awsFullName.length === 1) return this._types.get(awsFullName[0]) || null;
        const ns = this._namespaces.get(awsFullName[0]);
        return ns ? ns.getType(awsFullName.slice(1)) : null;
    }
    getOrCreateChildNamespace(awsFullName: string | Array<string>): Namespace {
        if(typeof awsFullName === 'string') awsFullName = this._splitPath(awsFullName);
        let ns = this._namespaces.get(awsFullName[0]);
        if(!ns) this._namespaces.set(awsFullName[0], ns = new Namespace(awsFullName[0], this));
        if(awsFullName.length === 1) return ns;
        return ns.getOrCreateChildNamespace(awsFullName.slice(1));
    }
    resolveType(awsFullName: string | Array<string>): Type | null {
        if(typeof awsFullName === 'string') awsFullName = this._splitPath(awsFullName);
        const type = this.getType(awsFullName);
        if(type) return type;
        if(this._parent) return this._parent.resolveType(awsFullName);
        return null;
    }
    toJSON() {
        return Object.assign({}, super.toJSON(), {
            _namespaces: fromPairs(Array.from(this._namespaces)),
            _types: fromPairs(Array.from(this._types))
        });
    }
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
