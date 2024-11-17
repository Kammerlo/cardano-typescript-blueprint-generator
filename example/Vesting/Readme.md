# Example Project for Cardano Blueprint Generator
In this example project, we will generate a blueprint for a vesting smart contract and use it to lock funds for a specific period of time.
We are using the official `Vesting` example from the [Aiken Documentation](https://aiken-lang.org/example--vesting).

## Steps
- (If you want to build the Aiken project) Install [Aiken](https://aiken-lang.org/installation-instructions) and run `aiken build` in the `vesting-aiken` directory.
- Generate the blueprint files from the compiled Aiken project by using the cli `cardano-blueprint-generator -o ./src/generated ./vesting-aiken/plutus.json`
- Copy `.env.example` to `.env` and fill in the required values
- Run `npm install` to install all dependencies
- Run `npm run deposit` to lock funds in the smart contract
- TODO add unlock step


### Generated Files explained
Within the blueprint is only one validator defined. The name of the validator is called `vesting`.
Thats why the CLI generated a folder with the same name. 
Within this folder, you will find the following files:
- `_redeemer.ts` - Used for unlocking the funds, after the time has passed
  - This is just an empty data. So no fields are generated. 
- `Datum_opt.ts` - Used for locking the funds
  - Within Datum Opts you need to fill the following fields:
    - VestingDatumVestingDatum - Is of type constructor and thus a new file is generated which provides the needed fields.
- `VestingDatumVestingDatum.ts` - Data object for locking the funds
  - Within VestingDatumVestingDatum you need to fill the following fields:
    - `lock_unit` - The deadline until the funds are locked
    - `owner` - The owner of the funds
    - `beneficiary` - The beneficiary of the funds