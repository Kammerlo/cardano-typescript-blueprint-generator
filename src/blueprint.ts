import {CIP57Blueprint} from "./types/CIP57-Blueprint";
import {Validator} from "./types/Validator";
import {InterfaceDeclaration, Project, SourceFile} from "ts-morph";
import {DataTypeEnum} from "./types/DataTypeEnum";
import {BlueprintSchema} from "./types/BlueprintSchema";
import {GeneratorDocEnum} from "./types/GeneratorDocEnum";
import {BlueprintDatum} from "./types/BlueprintDatum";
import {processBytes, processConstructor, processInteger, processString, processXOf} from "./ProcessorFunctions";
import {writeConverter} from "./converter";
import {loadBlueprint} from "./util";

export async function processBlueprintByFilePath(blueprintJsonPath: string, generatedClassesPath = "./src/generated/") : Promise<boolean> {

    // Load the blueprint
    const blueprint = await loadBlueprint(blueprintJsonPath);
    processBlueprint(blueprint, generatedClassesPath);


    return true;
}

export async function processBlueprint(blueprint: CIP57Blueprint, generatedClassesPath: string) {
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
        name: title,
        isExported: true
    });
    processSchema(datum.schema, validatorSourceFile, validatorInterface, [], project, prefix)
    writeConverter(validatorSourceFile, validatorInterface, "toMeshJSData");
}

export async function processSchema(schema: BlueprintSchema, sourceFile : SourceFile, interfaceDecl : InterfaceDeclaration, docs : string[] = [], project: Project, prefix : string) {
    if(schema.anyOf) {
        schema = processXOf(schema, sourceFile, interfaceDecl, docs, project, prefix, GeneratorDocEnum.ANYOF, schema.anyOf);
    }
    if(schema.oneOf) {
        schema = processXOf(schema, sourceFile, interfaceDecl, docs, project, prefix, GeneratorDocEnum.ONEOF, schema.oneOf);
    }
    if(schema.allOf) {
        schema = processXOf(schema, sourceFile, interfaceDecl, docs, project, prefix, GeneratorDocEnum.ALLOF, schema.allOf);
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
            case DataTypeEnum.list:
                // TODO implement list
                break;
            case DataTypeEnum.map:
                // TODO implement map
                break;
        }
    }
}

