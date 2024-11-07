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
        isExported: true,
        statements: writer => {
            if(interfaceDecl.getProperties().length === 0) {
                writer.write("return [];");
                return;
            } else {
                writer.write("return {fields:[");
                const properties = interfaceDecl.getProperties();
                for(let i = 0; i < properties.length; i++) {
                    const value = properties[i];
                    const docs = value.getJsDocs().map(value => value.getInnerText());
                    if(docs.includes(GeneratorDocEnum.PRIMITIVE)) {
                        writer.writeLine("data." + value.getName() + ",");
                    }
                    if(docs.includes(GeneratorDocEnum.CONSTRUCTOR)) {
                        // check if there are multiple possible constructors by checking if the following indexes are increments of the current index
                        let indexNameTuple : [number, string][] = [[Number(properties[i].getJsDocs().reverse()[0].getInnerText()), properties[i].getName()]];
                        let currentIndex = indexNameTuple[0][0];
                        while(i + 1 < properties.length) {
                            if(properties[i + 1].getJsDocs().map(value => value.getInnerText()).includes(GeneratorDocEnum.CONSTRUCTOR)
                                && Number(properties[i + 1].getJsDocs().reverse()[0].getInnerText()) === currentIndex + 1) {
                                indexNameTuple.push([Number(properties[i + 1].getJsDocs().reverse()[0].getInnerText()), properties[i + 1].getName()]);
                                i++;
                                currentIndex++;
                            } else {
                                break;
                            }
                        }
                        if (indexNameTuple.length === 1) {
                            const value = indexNameTuple[0];
                            writer.writeLine("mConStr(" + value[0] + ", [" + value[1] + "ToData(data." + value[1] + ")]),");
                        } else {
                            indexNameTuple.forEach(value => {
                                writer.writeLine("data." + value[1] + " !== undefined ? mConStr(" + value[0] + ", [" + value[1] + "ToData(data." + value[1] + ")]) : ");
                            });
                            writer.writeLine("null,");
                        }
                    }
                }
                writer.write("]} as Data;");
            }
        }
    });
}