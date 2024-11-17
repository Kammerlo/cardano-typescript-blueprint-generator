# Example Project for Cardano Blueprint Generator
In this example project, we will generate a blueprint for a simple hello world smart contract 
and use it to lock funds in a smart contract.

We are using the `hello-world` example from the official [Aiken Documentation](https://aiken-lang.org/example--hello-world/basics).


## Steps
- (If you want to build the Aiken project) Install Aiken
- Install the Cardano Blueprint Generator CLI `npm i @kammerlo/cardano-blueprint-generator`
- Generate files from the compiled Aiken project. 
We will use the `plutus.json` which contains the compiled blueprint according to [CIP-57](https://developers.cardano.org/docs/governance/cardano-improvement-proposals/cip-0057/).
Run `cardano-blueprint-generator -o ./generated ./hello-world/plutus.json`
- Copy `.env.example` to `.env` and fill in the required values
- Run `npm run lock` - This will output the txHash which can be verified on any Cardano Explorer.
- To Unlock your funds
  - Copy the tx hash from the lock operation and add it to `src/unlock.js`
  - Run `npm run unlock` to unlock the funds

