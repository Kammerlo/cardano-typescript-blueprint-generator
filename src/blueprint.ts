import $RefParser from "@apidevtools/json-schema-ref-parser";
import {CIP57Blueprint} from "./types/CIP57-Blueprint";
import {Validator} from "./types/Validator";
import {InterfaceDeclaration, Project, SourceFile} from "ts-morph";
import {DataTypeEnum} from "./types/DataTypeEnum";
import {BlueprintSchema} from "./types/BlueprintSchema";
import {GeneratorDocEnum} from "./types/GeneratorDocEnum";
import {BlueprintDatum} from "./types/BlueprintDatum";
import {processBytes, processConstructor, processInteger, processString} from "./ProcessorFunctions";
import {writeConverter} from "./converter";

export async function processBlueprint(blueprintJsonPath: string, generatedClassesPath = "./src/generated/") : Promise<boolean> {

    // Load the blueprint
    const blueprint = await loadBlueprint(blueprintJsonPath);
    generateInterfaces(blueprint, generatedClassesPath);


    return true;
}

export async function loadBlueprint(path: string): Promise<CIP57Blueprint> {
    return await $RefParser.dereference(path);
}

export async function generateInterfaces(blueprint: CIP57Blueprint, generatedClassesPath: string) {
    const project = new Project();

    // Generate classes
    blueprint.validators.forEach(value => processValidator(value, project, generatedClassesPath));

    project.save();
}

export async function processValidator(validator : Validator, project: Project, prefix : string) {
    // title manipulation
    const titleSplit = validator.title.split(".");
    var title = "";
    if (titleSplit.length > 1) {
        prefix = prefix + "/" + titleSplit[0] + "/";
        title = titleSplit[1];

    } else {
        title = titleSplit[0];
    }

    if(validator.datum) {
        processDatum(project, prefix, title, validator.datum);
    }

    if(validator.redeemer) {
        processDatum(project, prefix, title, validator.redeemer);
    }

    if(validator.parameters)
        validator.parameters.forEach(value => {
            processDatum(project, prefix, title, value);
        })


    await project.save();
}

function processDatum(project: Project, prefix: string, title: string, datum: BlueprintDatum) {
    const validatorSourceFile = project.createSourceFile(prefix + title + datum.title + ".ts", "", {overwrite: true});
    validatorSourceFile.addStatements("/** Autogenerated file, do not modify **/");
    const validatorInterface = validatorSourceFile.addInterface({
        name: title
    });
    processSchema(datum.schema, validatorSourceFile, validatorInterface, [], project, prefix)
    writeConverter(validatorSourceFile, validatorInterface, "toMeshJSData");
}

export async function processSchema(schema: BlueprintSchema, sourceFile : SourceFile, interfaceDecl : InterfaceDeclaration, docs : string[] = [], project: Project, prefix : string) {
    if(schema.anyOf) {
        const title = schema.title!
        if (schema.anyOf.length > 1) {
            schema.anyOf.forEach(value => {
                value.title = title + value.title // append the title to the schema title
                processSchema(value, sourceFile, interfaceDecl, docs.concat([GeneratorDocEnum.ANYOF]), project, prefix)
            });
        } else {
            schema = schema.anyOf[0]; // if anyOf has only one element, we can ignore the anyOf
            schema.title = title + schema.title // append the title to the schema title
        }
    }
    if(schema.dataType) {
        switch (schema.dataType) {
            case DataTypeEnum.integer:
                processInteger(interfaceDecl, schema, docs);
                break;
            case DataTypeEnum.string:
                processString(interfaceDecl, schema, docs);
                break;
            case DataTypeEnum.bytes:
                processBytes(interfaceDecl, schema, docs);
                break;
            case DataTypeEnum.constructor:
                processConstructor(sourceFile, schema, interfaceDecl, docs, project, prefix);
                break;
        }
    }
}

