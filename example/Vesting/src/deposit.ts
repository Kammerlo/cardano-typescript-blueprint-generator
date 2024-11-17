import {Asset, BlockfrostProvider, deserializeAddress, mConStr0, MeshTxBuilder} from "@meshsdk/core";
import {getScript, getWallet, getWalletInfoForTx} from "./util";
// @ts-ignore
import dotenv from 'dotenv';
// @ts-ignore
import blueprint from "../vesting-aiken/plutus.json";
import {Datum_opt, toMeshJSData} from "./generated/vesting/Datum_opt";

dotenv.config();

export const blockfrost_api_key = process.env.BLOCKFROST_API_KEY || "";
export const wallet_mnemonic = process.env.MNEMONIC
    ? process.env.MNEMONIC.split(",")
    : "solution,".repeat(24).split(",").slice(0, 24);

const blockchainProvider = new BlockfrostProvider(blockfrost_api_key);
const wallet = getWallet(wallet_mnemonic, blockchainProvider);
const compileCode = blueprint.validators[0].compiledCode;
const { scriptCbor, scriptAddr } = getScript(compileCode);
const txBuilder = new MeshTxBuilder({
    fetcher: blockchainProvider,
    submitter: blockchainProvider
})

export async function deposit() {
    const {utxos, walletAddress} = await getWalletInfoForTx(wallet);
    // Defining variables for the smart Contract
    // we are locking 5 ADA
    const assets: Asset[] = [{
        unit: "lovelace",
        quantity: "5000000"
    }];
    // Locking for one minute
    const lockUntilTimestamp = new Date();
    lockUntilTimestamp.setMinutes(lockUntilTimestamp.getMinutes() + 1);
    // we want to unlock it ourselves
    const benificiary = deserializeAddress(walletAddress);

    const datum : Datum_opt = {
        VestingDatumVestingDatum: {
            lock_until: lockUntilTimestamp.getTime(),
            owner: deserializeAddress(walletAddress).pubKeyHash,
            beneficiary: deserializeAddress(walletAddress).pubKeyHash, // we want to unlock it ourselves
        }
    }

    await txBuilder
        .txOut(scriptAddr, assets)
        .txOutInlineDatumValue(toMeshJSData(datum))
        .changeAddress(walletAddress)
        .selectUtxosFrom(utxos)
        .complete();
    const signedTx = await wallet.signTx(txBuilder.txHex);
    return await wallet.submitTx(signedTx);
}

deposit().then((txHash) => {
    console.log("Transaction submitted with hash: " + txHash);
});