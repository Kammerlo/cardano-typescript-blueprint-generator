import {DataTypeEnum} from "./DataTypeEnum";

export type BlueprintSchema = {

    title?: string;
    description?: string;
    $comment?: string;
    dataType: DataTypeEnum;


    anyOf?: BlueprintSchema[];
    allOf?: BlueprintSchema[];
    oneOf?: BlueprintSchema[];
    not?: BlueprintSchema;

    // For { "dataType": "bytes" }
    enum?: string[];
    maxLength?: number;
    minLength?: number;

    // For { "dataType": "integer" }
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: number;
    minimum?: number;
    exclusiveMinimum?: number;

    // For { "dataType": "list" }
    items?: BlueprintSchema | BlueprintSchema[];
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;

    // For { "dataType": "map" }
    keys?: BlueprintSchema;
    values?: BlueprintSchema;
    // maxItems?: number; -> commented to avoid conflict with list
    // minItems?: number; -> commented to avoid conflict with list

    // For { "dataType": "constructor" }
    index?: number;
    fields?: BlueprintSchema[];

}