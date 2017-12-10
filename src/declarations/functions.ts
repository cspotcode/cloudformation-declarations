import { CFString, Value, LiteralOrRef, CFList, CFMap, BooleanCondition, CFBoolean, CFInteger } from "./core";
import { ConditionId } from "./template";

export interface Base64 {
    'Fn::Base64': Value<CFString>;
}
export function Base64(v: Base64['Fn::Base64']): Base64 & Value<CFString> {
    return {'Fn::Base64': v} as any;
}

export interface FindInMap {
    'Fn::FindInMap': [Value<CFString>, Value<CFString>, Value<CFString>];
}
export function FindInMap<V>(v: FindInMap['Fn::FindInMap']): FindInMap & Value<V> {
    return {'Fn::FindInMap': v} as any;
}

export interface GetAtt {
    'Fn::GetAtt': [CFString, LiteralOrRef<CFString>];
}
export function GetAtt<V>(v: GetAtt['Fn::GetAtt']): GetAtt & Value<V> {
    return {'Fn::GetAtt': v} as any;
}

export interface GetAZs {
    'Fn::GetAZs': LiteralOrRef<CFString>;
}
export function GetAZs(v: GetAZs['Fn::GetAZs']): GetAZs & Value<CFList<CFString>> {
    return {'Fn::GetAZs': v} as any;
}

export interface ImportValue {
    'Fn::ImportValue': Value<CFString>;
}
export function ImportValue<V>(v: ImportValue['Fn::ImportValue']): ImportValue & Value<V> {
    return {'Fn::ImportValue': v} as any;
}

export interface Join {
    'Fn::Join': [CFString, Value<Array<Value<CFString>>>];
}
export function Join(v: Join['Fn::Join']): Join & Value<CFString> {
    return {'Fn::Join': v} as any;
}

export interface Select<V> {
    'Fn::Select': [Value<CFInteger>, Value<CFList<Value<V>>>];
}
export function Select<V>(v: Select<V>['Fn::Select']): Select<V> & Value<V> {
    return {'Fn::Select': v} as any;
}

export interface Split {
    'Fn::Split': [CFString, Value<CFString>];
}
export function Split(v: Split['Fn::Split']): Split & Value<CFList<CFString>> {
    return {'Fn::Split': v} as any;
}

export interface Sub {
    'Fn::Sub': [Value<CFString>, Value<CFMap<Value<CFString>>>] | Value<CFString>;
}
export function Sub(v: Sub['Fn::Sub']): Sub & Value<CFString> {
    return {'Fn::Sub': v} as any;
}

export interface And {
    'Fn::And': CFList<BooleanCondition>;
}
export function And(v: And['Fn::And']): And & Value<CFBoolean> {
    return {'Fn::And': v} as any;
}

export interface Equals {
    'Fn::Equals': [Value<any>, Value<any>]
}
export function Equals(v: Equals['Fn::Equals']): Equals & Value<CFBoolean> {
    return {'Fn::Equals': v} as any;
}

export interface If<V> {
    'Fn::If': [ConditionId, Value<V>, Value<V>];
}
export function If<V>(v: If<V>['Fn::If']): If<V> & Value<V> {
    return {'Fn::If': v} as any;
}

export interface Not {
    'Fn::Not': [BooleanCondition]
}
export function Not(v: Not['Fn::Not']): Not & Value<CFBoolean> {
    return {'Fn::Not': v} as any;
}

export interface Or {
    'Fn::Or': Array<BooleanCondition>;
}
export function Or(v: Or['Fn::Or']): Or & Value<CFBoolean> {
    return {'Fn::Or': v} as any;
}