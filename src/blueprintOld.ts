import $RefParser from "@apidevtools/json-schema-ref-parser";
import {CIP57Blueprint} from "./types/CIP57-Blueprint";
import {Validator} from "./types/Validator";
import {BlueprintSchema} from "./types/BlueprintSchema";
import {
    ClassDeclaration,
    Project,
    PropertyDeclarationStructure,
    SourceFile
} from "ts-morph";
import {BlueprintDatum} from "./types/BlueprintDatum";

export async function processBlueprint(blueprintJsonPath: string, generatedClassesPath = "./src/generated/") : Promise<boolean> {

    // Load the blueprint
    const blueprint = await loadBlueprint(blueprintJsonPath);
    generateClasses(blueprint, generatedClassesPath);


    return true;
}

export async function loadBlueprint(path: string): Promise<CIP57Blueprint> {
    return await $RefParser.dereference(path);
}

export async function generateClasses(blueprint: CIP57Blueprint, generatedClassesPath: string) {
    const project = new Project();

    // Generate classes
    blueprint.validators.forEach(value => processValidator(value, project, generatedClassesPath));

    project.save();
}

export async function processValidator(validator : Validator, project: Project, prefix : string) {
    // title manipulation
    const titleSplit = validator.title.split(".");
    var title = "";
    if(titleSplit.length > 1) {
        prefix = prefix + "/" + titleSplit[0] + "/";
        title = titleSplit[1];
    } else {
        title = titleSplit[0];
    }


    const validatorSourceFile = project.createSourceFile(prefix + title + ".ts", "", {overwrite: true});
    const classDeclaration = validatorSourceFile.addClass({
        name: title,
        isExported: true,
        properties: [
            {
                name: "title",
                type: "string",
                initializer: `"${validator.title}"`
            },
            {
                name: "description",
                type: "string",
                initializer: `"${validator.description}"`
            },
            {
                name: "compiledCode",
                type: "string",
                initializer: `"${validator.compiledCode}"`
            },
            {
                name: "hash",
                type: "string",
                initializer: `"${validator.hash}"`
            }
        ]
    });
    processDatum(validator.datum, project, prefix + title + "_", classDeclaration, validatorSourceFile);

    // TODO need to add the redeemer and parameters
}

function processDatum(datum: BlueprintDatum | undefined, project: Project, prefix: string, classDeclaration : ClassDeclaration, sourceFile : SourceFile) {
    if(datum === undefined) {
        return;
    }
    const fileName = prefix + datum.title + ".ts";

    const datumSourceFile = project.createSourceFile(fileName, "", {overwrite: true});
    const datumClass = datumSourceFile.addClass({
        name: datum.title,
        isExported: true,
        properties: [
            {
                name: "title",
                type: "string",
                initializer: `"${datum.title}"`
            },
            {
                name: "description",
                type: "string",
                initializer: `"${datum.description}"`
            },
            {
                name: "purpose",
                type: "string",
                initializer: `"${datum.purpose}"`
            }
        ]
    });
    if (datum.title != null) {
        addPropertyToParent(datum.title, datum.title, classDeclaration, sourceFile);
    }
    processSchema(datum.schema, project, prefix + datum.title + "_", datumClass, datumSourceFile);


}

export async function processSchema(schema : BlueprintSchema, project : Project, prefix : string, parentClass : ClassDeclaration, parentSourceFile : SourceFile) {
    const sourceFile = project.createSourceFile(prefix + schema.title + ".ts", "", {overwrite: true});
    const classDeclaration = sourceFile.addClass({
        name: schema.title,
        isExported: true
    });
    if(schema.title) {
        classDeclaration.addProperty({
            name: "title",
            type: "string",
            initializer: `"${schema.title}"`
        });
    }
    if(schema.description) {
        classDeclaration.addProperty({
            name: "description",
            type: "string",
            initializer: `"${schema.description}"`
        });
    }
    if(schema.$comment) {
        classDeclaration.addProperty({
            name: "$comment",
            type: "string",
            initializer: `"${schema.$comment}"`
        });
    }
    classDeclaration.addProperty({
        name: "dataType",
        type: "string",
        initializer: `"${schema.dataType}"`
    });

    if (schema.title != null) {
        addPropertyToParent(schema.title, schema.title, parentClass, parentSourceFile);
    }
}

function addPropertyToParent(title : string, type : string, parentClass : ClassDeclaration, parentSourceFile : SourceFile) {
    parentClass.addProperty({
        name: title,
        type: type,
        initializer: `new ${type}()`
    });
    parentSourceFile.addImportDeclaration({
        moduleSpecifier: "./" + title,
        namedImports: [title]
    });
}