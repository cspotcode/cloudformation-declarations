import * as __JQueryImport from 'jquery';
import {JSDOM} from 'jsdom';
import * as ts from 'typescript';
import {without} from 'lodash';
import {sync as mkdirpSync} from 'mkdirp';
import * as fs from 'fs';
import * as Path from 'path';

export function log(...args: Array<any>) {
    console.log(...args);
}

export function JQueryFactory(w: Window): JQueryStatic {
    return (__JQueryImport as any)(w);
}

/**
 * Simple template renderer that uses ES6 template literals with interpolated values.
 * Arrays are concatenated.  false, null, and undefined are coerced to empty strings.
 * Functions are invoked and their result rendered per the rules above.
 */ 
export function template(tmpl: TemplateStringsArray, ...values: Array<any>): string {
    let acc = '';
    for(let i = 0; i < tmpl.length; i++) {
        acc += tmpl[i];
        if(values.length > i) {
            acc += valueToString(values[i]);
        }
    }
    return acc;
    
    function valueToString(val: any): string {
        if(val === false || val == null) return '';
        if(typeof val === 'string') return val;
        if(typeof val === 'function') return valueToString(val());
        if(val instanceof Array) {
            return val.map(v => valueToString(v)).join('');
        }
        return '' + val;
    }
}

export function normalizeUrl(url: string) {
    return url.replace(/#.*?$/, '');
}

/** Use TypeScript to pretty-print TS code. */
export function prettyPrintTs(source: string): string {
    // Use TypeScript's pretty-printer to format the code
    const sourceFile = ts.createSourceFile('source.ts', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    return ts.createPrinter().printFile(sourceFile);
}

export abstract class Cache<K, V> {
    private _cache = new Map<string, V>();
    maxItems = 20;
    private _lru: Array<string> = [];
    computeKey(key: K): string {
        return `${ key }`;
    }
    abstract createItem(key: K, computedKey: string): V;
    dispose(value: V, computedKey: string): void {}
    getOrCreate(key: K): V {
        const computedKey = this.computeKey(key);
        this
        let ret: V;
        if(this._cache.has(computedKey)) {
            ret = this._cache.get(computedKey)!;
        } else {
            ret = this.createItem(key, computedKey);
            this._cache.set(computedKey, ret);
        }
        this._lru = [...without(this._lru, computedKey), computedKey];
        if(this._lru.length > this.maxItems) {
            const removedComputedKey = this._lru.shift()!;
            const removedItem = this._cache.get(removedComputedKey)!;
            this.dispose(removedItem, removedComputedKey);
            this._cache.delete(removedComputedKey);
        }
        return ret;
    }
}

export function writeFile(path: string, contents: string) {
    mkdirpSync(Path.dirname(path));
    fs.writeFileSync(path, contents);
}

export function readFile(path: string): string {
    return fs.readFileSync(path, 'utf8');
}

export function readJsonFile(path: string): any {
    return JSON.parse(readFile(path));
}

export function writeJsonFile(path: string, val: any): void {
    writeFile(path, JSON.stringify(val, null, '    '));
}
