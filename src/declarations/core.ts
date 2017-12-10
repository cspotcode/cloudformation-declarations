import { ConditionId } from './template';
import * as Functions from './functions';

/* Non-project-specific TypeScript helpers and magic */
export type TODO = any;
export type Diff<T extends string, U extends string> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];
export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

/*
 * When Cloudformation talks about an "Integer", it's actually a JSON string made of digits. (e.g. `"100"`)
 * With that in mind, these types and corresponding factory functions help make it abundantly clear the correspondence
 * between Cloudfront types and JSON types.
 */
export type CFString = string;
export type CFBoolean = 'true' | 'false';
export function CFInteger(n: number) {return `${ n }`}
export type CFInteger = string;
export function CFDouble(n: number) {return `${ n }`}
export type CFDouble = string;
export function CFLong(n: number) {return `${ n }`}
export type CFLong = string;
export function CFTimestamp(d: string) {return d}
export type CFTimestamp = string; // TODO
export type CFJson = object; // TODO
export type CFList<T> = Array<T>;
export type CFMap<T> = {[key: string]: T};

/** For situations in which the *only* function you may use is a reference */
export type LiteralOrRef<V = any> = V | Ref;

export type BooleanCondition = Functions.And | Functions.Equals | Functions.Not | Functions.Or | ConditionRef;

/** Reference to a conditional declared elsewhere in the stack template */
export interface ConditionRef {
    Condition: ConditionId;
}

/**
 * Yields a value of type V.  In other words, can appear in the JSON where that type of value is expected and where functions are allowed to execute.
 * Can be a function that returns the value, or can be the literal value itself.
 */
// export type YieldsBrand<V> = V | ReturnsBrand<V>;

export interface Value<V> {
    __brandCloudfrontValue: V;
}
export type Yields<V> = Value<V>;
export type YieldsString = Yields<CFString>;
export type YieldsBoolean = Yields<CFBoolean>;

// Brand native types so that they match our Value<> interface.
declare global {
    interface String extends Value<string> {}
    interface Number extends Value<number> {}
    interface Array<T> extends Value<Array<T>> {}
}

/**
 * This is some sort of function or reference that ultimately yields a value of type V.
 * Allows the type system to understand what type a condition, value, reference, etc. will return.
 */
// interface ReturnsBrand<V> {
//     /** DO NOT USE IN CODE.  This is just type system branding. */
//     __brandReturnValue: V;
// }

// TODO this is currently unused; where should it be used?
export interface AbstractResource {
    type: string;
    Condition?: ConditionId;
    // Properties?: {};
    DeletionPolicy?: 'Delete' | 'Retain' | 'Snapshot';
    DependsOn?: CFString | Array<CFString>;
    Metadata?: object;
}

export interface Ref {
    Ref: CFString;
}

export function Ref<V>(ref: Ref['Ref']): Ref & Value<V> {
    return {Ref: ref} as any;
}
