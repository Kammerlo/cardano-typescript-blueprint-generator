import {InterfaceDeclaration, Project, SourceFile} from "ts-morph";
import {BlueprintSchema} from "./types/BlueprintSchema";
import {GeneratorDocEnum} from "./types/GeneratorDocEnum";
import {processSchema} from "./blueprint";
import {writeConverter} from "./converter";


export function processInteger(interfaceDecl: InterfaceDeclaration, schema: BlueprintSchema, docs: string[]) {
    interfaceDecl.addProperty({
        name: schema.title ? schema.title : interfaceDecl.getName() + "Int",
        type: "number",
        docs: docs.concat([GeneratorDocEnum.PRIMITIVE])
    });
}

export function processString(interfaceDecl: InterfaceDeclaration, schema: BlueprintSchema, docs: string[]) {
    interfaceDecl.addProperty({
        name: schema.title ? schema.title : interfaceDecl.getName() + "Str",
        type: "string",
        docs: docs.concat([GeneratorDocEnum.PRIMITIVE])
    });
}

export function processBytes(interfaceDecl: InterfaceDeclaration, schema: BlueprintSchema, docs: string[]) {
    interfaceDecl.addProperty({
        name: schema.title ? schema.title : interfaceDecl.getName() + "Bytes",
        type: "string",
        docs: docs.concat([GeneratorDocEnum.PRIMITIVE])
    });
}

export function processConstructor(sourceFile: SourceFile, schema: BlueprintSchema, interfaceDecl: InterfaceDeclaration, docs: string[], project : Project, prefix : string) {
    const constructorSourceFile = project.createSourceFile(prefix + schema.title + ".ts", "", {overwrite: true}); // TODO need to push the prefix down to the source file
    const newInterface = constructorSourceFile.addInterface({
        name: schema.title ? schema.title : interfaceDecl.getName() + "Constructor",
        isExported: true
    });
    schema.fields!.forEach(value => processSchema(value, constructorSourceFile, newInterface, [], project, prefix));

    interfaceDecl.addProperty({
        name: schema.title ? schema.title : interfaceDecl.getName() + "Constructor",
        type: newInterface.getName(),
        docs: docs.concat([GeneratorDocEnum.CONSTRUCTOR, schema.index!.toString()])
    });
    sourceFile.addImportDeclaration({
        moduleSpecifier: "./" + schema.title,
        namedImports: [schema.title!, schema.title! + "ToData"]
    })

    writeConverter(constructorSourceFile, newInterface, schema.title! + "ToData");
}

export function processXOf(schema: BlueprintSchema, sourceFile: SourceFile, interfaceDecl: InterfaceDeclaration, docs: string[], project: Project, prefix: string, docAddition : GeneratorDocEnum, subSchema: BlueprintSchema[]) {
    const title = schema.title!
    if (subSchema.length > 1) {
        subSchema.forEach(value => {
            value.title = title + value.title // append the title to the schema title
            processSchema(value, sourceFile, interfaceDecl, docs.concat([docAddition]), project, prefix)
        });
    } else {
        schema = subSchema[0]; // if anyOf has only one element, we can ignore the anyOf
        schema.title = title + schema.title // append the title to the schema title
    }
    return schema;
}