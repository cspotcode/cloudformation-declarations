import { ConditionId } from './template';

export type TODO = any;
export type Diff<T extends string, U extends string> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];
export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

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

export type LiteralOrRef<V = any> = V | Ref;

export namespace Functions {
    export interface Base64 {
        'Fn::Base64': Yields<CFString>;
    }
    export function Base64(v: Base64['Fn::Base64']): Base64 & YieldsBrand<CFString> {
        return {'Fn::Base64': v} as any;
    }

    export interface FindInMap {
        'Fn::FindInMap': [Yields<CFString>, Yields<CFString>, Yields<CFString>];
    }
    export function FindInMap<V>(v: FindInMap['Fn::FindInMap']): FindInMap & YieldsBrand<V> {
        return {'Fn::FindInMap': v} as any;
    }

    export interface GetAtt {
        'Fn::GetAtt': [CFString, LiteralOrRef<CFString>];
    }
    export function GetAtt<V>(v: GetAtt['Fn::GetAtt']): GetAtt & YieldsBrand<V> {
        return {'Fn::GetAtt': v} as any;
    }

    export interface GetAZs {
        'Fn::GetAZs': LiteralOrRef<CFString>;
    }
    export function GetAZs(v: GetAZs['Fn::GetAZs']): GetAZs & YieldsBrand<CFList<CFString>> {
        return {'Fn::GetAZs': v} as any;
    }

    export interface ImportValue {
        'Fn::ImportValue': Yields<CFString>;
    }
    export function ImportValue<V>(v: ImportValue['Fn::ImportValue']): ImportValue & YieldsBrand<V> {
        return {'Fn::ImportValue': v} as any;
    }

    export interface Join {
        'Fn::Join': [CFString, Yields<Array<Yields<CFString>>>];
    }
    export function Join(v: Join['Fn::Join']): Join & YieldsBrand<CFString> {
        return {'Fn::Join': v} as any;
    }

    export interface Select<V> {
        'Fn::Select': [Yields<CFInteger>, Yields<CFList<Yields<V>>>];
    }
    export function Select<V>(v: Select<V>['Fn::Select']): Select<V> & YieldsBrand<V> {
        return {'Fn::Select': v} as any;
    }

    export interface Split {
        'Fn::Split': [CFString, Yields<CFString>];
    }
    export function Split(v: Split['Fn::Split']): Split & YieldsBrand<CFList<CFString>> {
        return {'Fn::Split': v} as any;
    }

    export interface Sub {
        'Fn::Sub': [Yields<CFString>, Yields<CFMap<Yields<CFString>>>] | Yields<CFString>;
    }
    export function Sub(v: Sub['Fn::Sub']): Sub & YieldsBrand<CFString> {
        return {'Fn::Sub': v} as any;
    }

    export interface And {
        'Fn::And': CFList<BooleanCondition>;
    }
    export function And(v: And['Fn::And']): And & YieldsBrand<CFBoolean> {
        return {'Fn::And': v} as any;
    }

    export interface Equals {
        'Fn::Equals': [Yields<any>, Yields<any>]
    }
    export function Equals(v: Equals['Fn::Equals']): Equals & YieldsBrand<CFBoolean> {
        return {'Fn::Equals': v} as any;
    }

    export interface If<V> {
        'Fn::If': [ConditionId, Yields<V>, Yields<V>];
    }
    export function If<V>(v: If<V>['Fn::If']): If<V> & YieldsBrand<V> {
        return {'Fn::If': v} as any;
    }

    export interface Not {
        'Fn::Not': [BooleanCondition]
    }
    export function Not(v: Not['Fn::Not']): Not & YieldsBrand<CFBoolean> {
        return {'Fn::Not': v} as any;
    }

    export interface Or {
        'Fn::Or': Array<BooleanCondition>;
    }
    export function Or(v: Or['Fn::Or']): Or & YieldsBrand<CFBoolean> {
        return {'Fn::Or': v} as any;
    }
}

export type BooleanCondition = Functions.And | Functions.Equals | Functions.Not | Functions.Or | ConditionRef;

export interface ConditionRef {
    Condition: ConditionId;
}

/**
 * Yields a value of type V.  In other words, can appear in the JSON where that type of value is expected and where functions are allowed to execute.
 * Can be a function that returns the value, or can be the literal value itself.
 */
// export type YieldsBrand<V> = V | ReturnsBrand<V>;

export interface YieldsBrand<V> {
    __brandYieldsValue: V;
}
export type Yields<V> = V | YieldsBrand<V>;
export type YieldsString = Yields<CFString>;
export type YieldsBoolean = Yields<CFBoolean>;

/**
 * This is some sort of function or reference that ultimately yields a value of type V.
 * Allows the type system to understand what type a condition, value, reference, etc. will return.
 */
// interface ReturnsBrand<V> {
//     /** DO NOT USE IN CODE.  This is just type system branding. */
//     __brandReturnValue: V;
// }

export interface AbstractResource {
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

export interface HasCreationPolicy {
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

export interface HasUpdatePolicy {
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

export interface Ref {
    Ref: CFString;
}

export function Ref<V>(ref: Ref['Ref']): Ref & YieldsBrand<V> {
    return {Ref: ref} as any;
}
