# Cardano Typescript Blueprint Generator
This repository will contain a typescript blueprint generator for [Cardano CIP-57](https://developers.cardano.org/docs/governance/cardano-improvement-proposals/cip-0057/).
The idea is to make the entry for new developer as easy as possible. Filling a datum for a smart contract is challenging at the beginning, due to it's types and the way it is structured. 
This generator will help to generate the typescript interfaces for the datum and redeemer, which can be used in a typescript project.

This repository currently contains only the blueprint generator for [MeshJS](https://meshjs.dev/).

#### ToDo List:
This repository is still under development and will be updated frequently. I'm working on this project as a hobby, so I can't guarantee any deadlines.
If you are missing anything, feel free to open an issue, where we can discuss all details.

- [ ] Implement all CIP-57 types
- [ ] Add more complex examples
- [ ] Add tests

#### Example Project for Cardano Blueprint Generator
In this example project, we will generate a blueprint for a simple hello world smart contract. I will add more example projects in the future.
We are using the `hello-world` example from the official [Aiken Documentation](https://aiken-lang.org/example--hello-world/basics).
Follow the steps describe in the readme of the example project.

### Installation
This project can be used an npm package via CLI or as a library in your project.

- To install the CLI:
  - run `npm i -g @kammerlo/cardano-blueprint-generator`
  - To generate source simply run: `cardano-blueprint-generator -o <OUTPUT> <PATH_TO_BLUEPRINT_JSON>`
- To use it as a library:
  - run `npm i @kammerlo/cardano-blueprint-generator`
  - ```
    import {processBlueprintByFilePath} from "./blueprint";
    processBlueprintByFilePath(<PATH_TO_BLUEPRINT_JSON>, <OUTPUT>);
    ```
    
### Contribution
If you want to contribute to this project, feel free to open a pull request or an issue. I'm happy to get any feedback or help.
