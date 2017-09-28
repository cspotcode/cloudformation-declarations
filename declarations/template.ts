// Very WIP typings for a CloudFormation stack template
export * from './common';
export * from './generated/aws-cloudformation';

import { TODO, BooleanCondition, CFString, CFInteger, CFBoolean } from './common';
import { Resource } from './generated/aws-cloudformation';

export interface Template {
    AWSTemplateFormatVersion: '2010-09-09';
    Description?: string;
    Metadata?: object;
    Parameters?: {
        [parameterId: string]: Parameter;
    };
    Mappings?: {
        [mappingName: string]: Mapping;
    };
    Conditions?: {
        [conditionName: string]: BooleanCondition;
    };
    Transform?: TODO;
    Resources?: {
        [name: string]: Resource;
    };
    Outputs?: {
        [logicalId: string]: Output;
    };
}

export interface Parameter {
    AllowedPattern?: string; // TODO regexp as a string?
    AllowedValues?: Array<string>; // TODO?
    ConstraintDescription?: string;
    Default?: CFString; // TODO?
    Description?: string;
    MaxLength?: CFInteger; // number
    MaxValue?: TODO;
    MinLength?: CFInteger; // number
    MinValue?: TODO;
    NoEcho?: CFBoolean;
    Type: ParameterType;
}

export interface Mapping {
    [topLevelKey: string]: {
        [secondLevelKey: string]: TODO;
    };
}

export interface Output {
    /** A String type that describes the output value. The description can be a maximum of 4 K in length.  */
    Description?: string;
    /**
     * The value of the property returned by the `aws cloudformation describe-stacks` command.
     * The value of an output can include literals, parameter references, pseudo-parameters, a mapping value, or intrinsic functions.
     */
    Value: string;
    Export?: {
        /** 
         * The name of the resource output to be exported for a cross-stack reference.
         */
        Name: string;
    }
}

export type AWSResourceType = Resource['Type'];
export type ParameterType =
    'String' | // A literal string
    'Number' | // An integer or float
    'List<Number>' | // An array of integers or floats
    'CommaDelimitedList' | // An array of literal strings that are separated by commas
    'AWS::EC2::AvailabilityZone::Name' |
    'AWS::EC2::Image::Id' |
    'AWS::EC2::Instance::Id' |
    'AWS::EC2::KeyPair::KeyName' |
    'AWS::EC2::SecurityGroup::GroupName' |
    'AWS::EC2::SecurityGroup::Id' |
    'AWS::EC2::Subnet::Id' |
    'AWS::EC2::Volume::Id' |
    'AWS::EC2::VPC::Id' |
    'AWS::Route53::HostedZone::Id' |
    'List<AWS::EC2::AvailabilityZone::Name>' |
    'List<AWS::EC2::Image::Id>' |
    'List<AWS::EC2::Instance::Id>' |
    'List<AWS::EC2::SecurityGroup::GroupName>' |
    'List<AWS::EC2::SecurityGroup::Id>' |
    'List<AWS::EC2::Subnet::Id>' |
    'List<AWS::EC2::Volume::Id>' |
    'List<AWS::EC2::VPC::Id>' |
    'List<AWS::Route53::HostedZone::Id>';
export type AWSRegion = string; // TODO union of region names
export type ConditionId = string; // TODO IDs of declared conditions
