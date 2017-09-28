import { ConditionId } from './template';

export type TODO = any;
export type Diff<T extends string, U extends string> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];
export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

export type CFString = string;
export type CFBoolean = 'true' | 'false';
export type CFInteger = string;
export type CFDouble = string;
export type CFLong = string;
export type CFTimestamp = string; // TODO
export type CFJson = object; // TODO
export type CFList<T> = Array<T>;
export type CFMap<T> = {[key: string]: T};

export type LiteralOrRef<V = any> = V | (Ref & ReturnsBrand<V>);

function factory<FnType, Key extends FnType>(key: Key) {
    return function(v: FnType[Key]): FnType {
        return { [key]: v; };
    }
}

export namespace Functions {
    export const Base64 = factory<Base64>('Fn::Base64');
    export interface Base64 extends ReturnsBrand<CFString> {
        'Fn::Base64': Yields<CFString>;
    }
    export const FindInMap<V> = factory<FindInMap>('Fn::FindInMap');
    export interface FindInMap<V> extends ReturnsBrand<TODO> {
        'Fn::FindInMap': [Yields<CFString>, Yields<CFString>, Yields<CFString>];
    }
    export const GetAtt = factory<GetAtt>('Fn::GetAtt');
    export interface GetAtt extends ReturnsBrand<TODO> {
        'Fn::GetAtt': [CFString, LiteralOrRef<CFString>];
    }
    export const GetAZs = factory<GetAZs>('Fn::GetAZs');
    export interface GetAZs extends ReturnsBrand<Array<CFString>> {
        'Fn::GetAZs': LiteralOrRef<CFString>;
    }
    export const ImportValue<V> = factory<ImportValue<V>>('Fn::ImportValue');
    export interface ImportValue<V> extends ReturnsBrand<TODO> {
        'Fn::ImportValue': Yields<CFString>;
    }
    export const Join = factory<Join>('Fn::Join');
    export interface Join extends ReturnsBrand<CFString> {
        'Fn::Join': [CFString, Yields<Array<Yields<CFString>>>];
    }
    export const Select<V> = factory<Select<V>>('Fn::Select');
    export interface Select<V> extends ReturnsBrand<V> {
        'Fn::Select': [Yields<CFInteger>, Yields<Array<Yields<V>>>];
    }
    export const Split = factory<Split>('Fn::Split');
    export interface Split extends ReturnsBrand<Array<CFString>> {
        'Fn::Split': [CFString, Yields<CFString>];
    }
    export const Sub = factory<Sub>('Fn::Sub');
    export interface Sub extends ReturnsBrand<CFString> {
        'Fn::Sub': [Yields<CFString>, Yields<CFMap<Yields<CFString>>>] | Yields<CFString>;
    };

    export const And = factory<And>('Fn::And');
    export interface And extends ReturnsBrand<boolean> {
        'Fn::And': Array<BooleanCondition>;
    }
    export const Equals = factory<Equals>('Fn::Equals');
    export interface Equals extends ReturnsBrand<boolean> {
        'Fn::Equals': [Yields<any>, Yields<any>]
    }
    export const If<V> = factory<If<V>>('Fn::If');
    export interface If<V> extends ReturnsBrand<V> {
        'Fn::If': [ConditionId, Yields<V>, Yields<V>];
    }
    export const Not = factory<Not>('Fn::Not');
    export interface Not extends ReturnsBrand<boolean> {
        'Fn::Not': [BooleanCondition]
    }
    export const Or = factory<Or>('Fn::Or');
    export interface Or extends ReturnsBrand<boolean> {
        'Fn::Or': Array<BooleanCondition>;
    };
}

export type BooleanCondition = Functions.And | Functions.Equals | Functions.Not | Functions.Or | ConditionRef;

export interface ConditionRef {
    Condition: ConditionId;
}

/**
 * Yields a value of type V.  In other words, can appear in the JSON where that type of value is expected and where functions are allowed to execute.
 * Can be a function that returns the value, or can be the literal value itself.
 */
type YieldsBrand<V> = V | ReturnsBrand<V>;

export type Yields<V> = V | Returns<V>;
type Returns<V> = Functions.Select<V> | Functions.If<V> | Ref;
export type YieldsBoolean = Yields<CFBoolean> | ReturnsBoolean;
type ReturnsBoolean = Returns<CFBoolean> | Functions.And | Functions.Equals | Functions.Not | Functions.Or | ConditionRef;
export type YieldsString = Yields<CFString> | ReturnsString;
type ReturnsString = Returns<CFString> | Functions.Base64 | Functions.Join | Functions.Sub;

/**
 * This is some sort of function or reference that ultimately yields a value of type V.
 * Allows the type system to understand what type a condition, value, reference, etc. will return.
 */
export interface ReturnsBrand<V> {
    /** DO NOT USE IN CODE.  This is just type system branding. */
    __brandReturnValue: V;
}

export class AbstractResource<C extends AbstractResource = AbstractResource> {
    constructor(props: C) { Object.assign(this, props); }
    type: string;
    Condition?: ConditionId;
    // Properties?: {};
    DeletionPolicy?: 'Delete' | 'Retain' | 'Snapshot';
    DependsOn?: CFString | Array<CFString>;
    Metadata?: object;
}

// Add "CreationPolicy" and "UpdatePolicy" support to only the resources that support it
declare module './generated/aws-cloudformation' {
    namespace AWS.AutoScaling {
        interface AutoScalingGroup extends HasCreationPolicy, HasUpdatePolicy {}
    }
    namespace AWS.EC2 {
        interface Instance extends HasCreationPolicy {}
    }
    namespace AWS.CloudFormation {
        interface WaitCondition extends HasCreationPolicy {}
    }
}

interface HasCreationPolicy {
    CreationPolicy?: {
        AutoScalingCreationPolicy?: {
            MinSuccessfulInstancesPercent?: CFInteger;
        }
        ResourceSignal?: {
            Count?: CFString; // number
            Timeout?: CFInteger;
        }
    };
}

interface HasUpdatePolicy {
    UpdatePolicy?: {
        AutoScalingRollingUpdate?: {
            MaxBatchSize?: CFInteger;
            MinInstancesInService?: CFInteger;
            MinSuccessfulInstancesPercent?: CFInteger;
            PauseTime: CFString;
            SuspendProcesses?: Array<TODO>;
            WaitOnResourceSignals?: CFBoolean;
        }
        AutoScalingReplacingUpdate?: {
            WillReplace?: CFBoolean;
        }
        AutoScalingScheduledAction?: {
            IgnoreUnmodifiedGroupSizeProperties?: CFBoolean;
        }
    }
}

export interface Ref<K extends CFString = CFString> {
    Ref: K;
}

export function Ref<K extends CFString>(ref: K): Ref<K> {
    return {Ref: ref};
}

/** A Ref that we know refers to a specific type of value */
export interface RefReturns<K extends CFString, V> extends Ref<K>, ReturnsBrand<V> {}
