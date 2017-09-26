
export interface SpecFile {
    ResourceType: SpecTypes;
    PropertyTypes: SpecTypes;
}
export interface SpecTypes {
    [name: string]: SpecType;
}
export interface SpecType {
    Documentation: string;
    Properties: {
        [name: string]: SpecProperty;
    }
}
export interface SpecProperty {
    Documentation: string;
    UpdateType: 'Mutable' | 'Immutable' | 'Conditional';
    Required: boolean;
    PrimitiveType?: string;
    Type?: string;
    ItemType?: string;
    PrimitiveItemType?: string;
}