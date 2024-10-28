// write top level converter function
import {InterfaceDeclaration, SourceFile} from "ts-morph";
import {GeneratorDocEnum} from "./types/GeneratorDocEnum";
import {addMeshJsDataToFile} from "./util";

export function writeConverter(sourceFile: SourceFile, interfaceDecl: InterfaceDeclaration, functionName: string) {
    // Here we need to add the converter Function to MeshJS Data
    addMeshJsDataToFile(sourceFile);


    sourceFile.addFunction({
        name: functionName,
        parameters: [{name: "data", type: interfaceDecl.getName()}],
        returnType: "Data",
        statements: writer => {
            if(interfaceDecl.getProperties().length === 0) {
                writer.write("return [];");
                return;
            } else {
                writer.write("return {fields:[");
                interfaceDecl.getProperties().forEach(value => {
                    const docs = value.getJsDocs().map(value => value.getInnerText());
                    if (docs.includes(GeneratorDocEnum.PRIMITIVE)) {
                        writer.writeLine("data." + value.getName() + ",");
                    }
                    if (docs.includes(GeneratorDocEnum.CONSTRUCTOR)) {
                        if (docs.includes(GeneratorDocEnum.ANYOF)) {

                        }
                        const index = value.getJsDocs().reverse()[0].getInnerText();
                        writer.writeLine("mConStr(" + index + ", [" + value.getName() + "ToData(data." + value.getName() + ")]),");
                    }
                });
                writer.write("]} as Data;");
            }
        }
    });
}