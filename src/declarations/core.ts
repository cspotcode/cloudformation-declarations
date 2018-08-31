import { ConditionId } from './template';
import * as Functions from './functions';

/* Non-project-specific TypeScript helpers and magic */
export type TODO = any;
export type Diff<T extends string, U extends string> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];
export type StringKeyOf<T> = Extract<keyof T, string>;
export type Omit<T, K extends keyof T> = Pick<T, Diff<StringKeyOf<T>, K>>;

/**
 * Identity function for declaring types within deeply nested object literals.
 * Normal Intellisense covers most situations.  However, when a property's type is `any` or is too loose,
 * but you want Intellisense for a more specific interface, wrap the value in this function.
 * 
 *     const someBigObject: SomeBigInterface = {
 *       aPropertyOfTypeAny: T<AWS.APIGateway.Account>({
 *         Properties: {
 *           // <-- get useful Intellisense for AWS.APIGateway.Account
 *         }
 *       })
 *     }
 * 
 * For example, a stack's `Resources` object can contain any kind of Cloudfront
 * resource so Intellisense isn't particularly helpful.  We already offer factory functions
 * for all resources; for other situations, use `T`.
 */
export function T<V>(value: V): V {
    return value;
}

/*
 * When Cloudformation talks about an "Integer", it's actually a JSON string made of digits. (e.g. `"100"`)
 * With that in mind, these types and corresponding factory functions help make it abundantly clear the correspondence
 * between Cloudfront types and JSON types.
 */

export type CFString = string;
/**
 * Convert a JS boolean to a string.
 * Cloudformation expects booleans to be either the string 'true' or 'false'.
 */
export function CFBoolean(b: boolean): CFBoolean {return `${ b }` as CFBoolean}
export type CFBoolean = 'true' | 'false';
/**
 * Convert a JS number to a string.
 * Cloudformation expects numbers as strings, presumably to avoid differences in the implementations of numbers in various JSON parsers and serializers.
 */
export function CFInteger(n: number) {return `${ n }`}
export type CFInteger = string;
/**
 * Convert a JS number to a string.
 * Cloudformation expects numbers as strings, presumably to avoid differences in the implementations of numbers in various JSON parsers and serializers.
 */
export function CFDouble(n: number) {return `${ n }`}
export type CFDouble = string;
/**
 * Convert a JS number to a string.
 * Cloudformation expects numbers as strings, presumably to avoid differences in the implementations of numbers in various JSON parsers and serializers.
 */
export function CFLong(n: number) {return `${ n }`}
export type CFLong = string;
export function CFTimestamp(d: string) {return d}
export type CFTimestamp = string; // TODO
export type CFJson = object; // TODO
export type CFList<T> = Array<T>;
export type CFMap<T> = {[key: string]: T};

export type BooleanCondition = Effectively<CFBoolean, (Functions.And | Functions.Equals | Functions.Not | Functions.Or | ConditionRef)>;

/** Reference to a conditional declared elsewhere in the stack template */
export interface ConditionRef {
    Condition: ConditionId;
}
export function ConditionRef(conditionId: ConditionId): Effectively<CFBoolean, ConditionRef> {
    return {Condition: conditionId} as any;
}

/**
 * When we "lie" to the typesystem, a branding property stores the real type.
 * For example, when we say that a {"Ref": ""} is actually a string,
 * we also brand the return value with an interface.  Something like:
 * 
 *     string & {__cloudfrontIsActually: {Ref: string}}
 * 
 */
export type Effectively<PretendingToBe, IsActually> = PretendingToBe & Actually<IsActually>;
export interface Actually<T> {
    __cloudfrontIsActually: T;
}

// TODO this is currently unused; where should it be used?
export interface CommonResourceProps {
    Condition?: ConditionId;
    // Properties?: {};
    DeletionPolicy?: 'Delete' | 'Retain' | 'Snapshot';
    DependsOn?: CFString | Array<CFString>;
    Metadata?: object;
}
