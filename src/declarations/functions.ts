import { CFString, CFList, CFMap, BooleanCondition, CFBoolean, CFInteger, Effectively } from "./core";
import { ConditionId } from "./template";

export interface Base64 {
    'Fn::Base64': CFString;
}
export function Base64(v: Base64['Fn::Base64']): Effectively<CFString, Base64> {
    return {'Fn::Base64': v} as any;
}

export interface FindInMap {
    'Fn::FindInMap': [CFString, CFString, CFString];
}
export function FindInMap<V>(v: FindInMap['Fn::FindInMap']): Effectively<V, FindInMap> {
    return {'Fn::FindInMap': v} as any;
}

export interface GetAtt {
    'Fn::GetAtt': [CFString, CFString];
}
export function GetAtt<V>(v: GetAtt['Fn::GetAtt']): Effectively<V, GetAtt> {
    return {'Fn::GetAtt': v} as any;
}

export interface GetAZs {
    'Fn::GetAZs': CFString;
}
export function GetAZs(v: GetAZs['Fn::GetAZs']): Effectively<CFList<CFString>, GetAZs> {
    return {'Fn::GetAZs': v} as any;
}

export interface ImportValue {
    'Fn::ImportValue': CFString;
}
export function ImportValue<V>(v: ImportValue['Fn::ImportValue']): Effectively<V, ImportValue> {
    return {'Fn::ImportValue': v} as any;
}

export interface Join {
    'Fn::Join': [CFString, Array<CFString>];
}
export function Join(v: Join['Fn::Join']): Effectively<CFString, Join> {
    return {'Fn::Join': v} as any;
}

export interface Select<V> {
    'Fn::Select': [CFInteger, CFList<V>];
}
export function Select<V>(v: Select<V>['Fn::Select']): Effectively<V, Select<V>> {
    return {'Fn::Select': v} as any;
}

export interface Split {
    'Fn::Split': [CFString, CFString];
}
export function Split(v: Split['Fn::Split']): Effectively<CFList<CFString>, Split> {
    return {'Fn::Split': v} as any;
}

export interface Sub {
    'Fn::Sub': [CFString, CFMap<CFString>] | CFString;
}
export function Sub(v: Sub['Fn::Sub']): Effectively<CFString, Sub> {
    return {'Fn::Sub': v} as any;
}

export interface And {
    'Fn::And': CFList<BooleanCondition>;
}
export function And(v: And['Fn::And']): Effectively<CFBoolean, And> {
    return {'Fn::And': v} as any;
}

export interface Equals {
    'Fn::Equals': [any, any]
}
export function Equals(v: Equals['Fn::Equals']): Effectively<CFBoolean, Equals> {
    return {'Fn::Equals': v} as any;
}

export interface If<V> {
    'Fn::If': [ConditionId, V, V];
}
export function If<V>(v: If<V>['Fn::If']): Effectively<V, If<V>> {
    return {'Fn::If': v} as any;
}

export interface Not {
    'Fn::Not': [BooleanCondition]
}
export function Not(v: Not['Fn::Not']): Effectively<CFBoolean, Not> {
    return {'Fn::Not': v} as any;
}

export interface Or {
    'Fn::Or': Array<BooleanCondition>;
}
export function Or(v: Or['Fn::Or']): Effectively<CFBoolean, Or> {
    return {'Fn::Or': v} as any;
}

export interface Ref {
    Ref: CFString;
}
export function Ref<V>(ref: Ref['Ref']): Effectively<V, Ref> {
    return {Ref: ref} as any;
}