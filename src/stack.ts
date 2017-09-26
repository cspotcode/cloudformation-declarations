// Very WIP typings for a CloudFormation stack template

export interface Stack {
    AWSTemplateFormatVersion: string;
    Description: string;
    Parameters: {
        [name: string]: {
            Type: CFTypeString;
            Description: string;
            ConstraintDescription: string;
            Default?: string; // TODO?
            AllowedValues?: Array<string>; // TODO?
            AllowedPattern?: string; // TODO regexp as a string?
            MinLength?: string; // number
            MaxLength?: string; // number
        }
    };
    Mappings: {
        [todo: string]: {
            [region in AWSRegion]: {
                [todo: string]: string; // URL?
            }
        }
    },

    Resources: {
        [name: string]: {
            Type: AWSResourceType;
            Properties: {
                [name: string]: TODO;
            }
            CreationPolicy: {
                ResourceSignal: {
                    Timeout: string;
                    Count: string; // number
                }
            },
            UpdatePolicy: {
                AutoScalingRollingUpdate: {
                    MinInstancesInService: 
                }
            }
        }
    }
}

type AWSResourceType = string; // TODO union of types of AWS resources (e.g. AWS::AutoScaling::AutoScalingGroup)
type CFTypeString = string; // TODO
type AWSRegion = string; // TODO union of region names

type TODO = any;
