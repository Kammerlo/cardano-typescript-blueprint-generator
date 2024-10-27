import $RefParser from "@apidevtools/json-schema-ref-parser";
import {CIP57Blueprint} from "./types/CIP57-Blueprint";
import {Validator} from "./types/Validator";
import {InterfaceDeclaration, Project, SourceFile} from "ts-morph";
import {DataTypeEnum} from "./types/DataTypeEnum";
import {BlueprintSchema} from "./types/BlueprintSchema";
import {GeneratorDocEnum} from "./types/GeneratorDocEnum";

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


    const validatorSourceFile = project.createSourceFile(prefix + title + ".ts", "", {overwrite: true});
    validatorSourceFile.addStatements("/** Autogenerated file, do not modify **/");
    const validatorInterface = validatorSourceFile.addInterface({
        name: title
    });
    processSchema(validator.redeemer.schema, validatorSourceFile, validatorInterface)
    writeConverter(validatorSourceFile, validatorInterface);

    await project.save();
}

function writeConverter(sourceFile: SourceFile, interfaceDecl: InterfaceDeclaration) {
    // Here we need to add the converter Function to MeshJS Data
    sourceFile.addImportDeclaration({
        moduleSpecifier: "@meshsdk/core",
        namedImports: ["Data", "mConStr"]
    })


    sourceFile.addFunction({
        name: "toMeshJSData",
        parameters: [{name: "data", type: interfaceDecl.getName()}],
        returnType: "Data",
        statements: writer => {
            writer.write("return {fields:[");
            interfaceDecl.getProperties().forEach(value => {
                const docs = value.getJsDocs().map(value => value.getInnerText());
                if (docs.includes(GeneratorDocEnum.PRIMITIVE)) {
                    writer.writeLine("data." + value.getName() + ",");
                }
                if (docs.includes(GeneratorDocEnum.CONSTRUCTOR)) {
                    const index = value.getJsDocs()[1].getInnerText();
                    writer.writeLine("mConStr(" + index + ", [" + value.getName()+ "ToData(data." + value.getName() + ")]),");
                }
            });
            writer.write("]} as Data;");
        }
    });
}

function processSchema(schema: BlueprintSchema, sourceFile : SourceFile, interfaceDecl : InterfaceDeclaration, docs : string[] = []) {
    switch (schema.dataType) {
        case DataTypeEnum.integer:
            interfaceDecl.addProperty({
                name: schema.title ? schema.title : interfaceDecl.getName() + "Int",
                type: "number",
                docs: docs.concat([GeneratorDocEnum.PRIMITIVE])
            });
            break;
        case DataTypeEnum.string:
            interfaceDecl.addProperty({
                name: schema.title ? schema.title : interfaceDecl.getName() + "Str",
                type: "string",
                docs: docs.concat([GeneratorDocEnum.PRIMITIVE])
            });
            break;
        case DataTypeEnum.bytes:
            interfaceDecl.addProperty({
                name: schema.title ? schema.title : interfaceDecl.getName() + "Bytes",
                type: "string",
                docs: docs.concat([GeneratorDocEnum.PRIMITIVE])
            });
            break;
        case DataTypeEnum.constructor:
            const newInterface = sourceFile.addInterface({
                name: schema.title ? schema.title : interfaceDecl.getName() + "Constructor"
            });
            schema.fields!.forEach(value => processSchema(value, sourceFile, newInterface));
            interfaceDecl.addProperty({
                name: schema.title ? schema.title : interfaceDecl.getName() + "Constructor",
                type: newInterface.getName(),
                docs: docs.concat([GeneratorDocEnum.CONSTRUCTOR, schema.index!.toString()])
            });
            sourceFile.addFunction({
                name: schema.title + "ToData",
                parameters: [{name: "data", type: newInterface.getName()}],
                returnType: "Data",
                statements: writer => {
                    writer.write("return {fields:[");
                    newInterface.getProperties().forEach(value => {
                        const docs = value.getJsDocs().map(value => value.getInnerText());
                        if (docs.includes(GeneratorDocEnum.PRIMITIVE)) {
                            writer.writeLine("data." + value.getName() + ",");
                        }
                        if (docs.includes(GeneratorDocEnum.CONSTRUCTOR)) {
                            const index = value.getJsDocs()[1].getInnerText();
                            writer.writeLine("mConStr(" + index + ", [" + value.getName()+ "ToData(data." + value.getName() + ")]),");
                        }
                    });
                    writer.write("]} as Data;");
                }
            });
            break;
    }
}

