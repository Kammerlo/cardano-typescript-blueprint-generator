import {BlueprintDatum} from "./BlueprintDatum";

export type Validator = {
    title: string;
    description?: string;
    compiledCode?: string;
    hash?: string;
    datum?: BlueprintDatum;
    redeemer: BlueprintDatum;
    parameters?: BlueprintDatum[];
}