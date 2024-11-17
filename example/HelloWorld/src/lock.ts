import {
    Asset,
    BlockfrostProvider,
    deserializeAddress,
    MeshTxBuilder,
} from "@meshsdk/core";
// @ts-ignore
import dotenv from 'dotenv';
// @ts-ignore
import blueprint from "../hello-world/plutus.json";
// @ts-ignore
import {Datum, toMeshJSData} from "./generated/hello_world/Datum";
// @ts-ignore
import {getScript, getWallet} from './util';
dotenv.config();

export const blockfrost_api_key = process.env.BLOCKFROST_API_KEY || "";
export const wallet_mnemonic = process.env.MNEMONIC
    ? process.env.MNEMONIC.split(",")
    : "solution,".repeat(24).split(",").slice(0, 24);

const blockchainProvider = new BlockfrostProvider(blockfrost_api_key);
const wallet = getWallet(wallet_mnemonic, blockchainProvider);
const compileCode = blueprint.validators[0].compiledCode;
const { scriptCbor, scriptAddr } = getScript(compileCode);


export async function lockAsset() {
    const walletAddress = await wallet.getChangeAddress();
    const utxos = await wallet.getUtxos();
    const signerHash = deserializeAddress(walletAddress).pubKeyHash;
    // creating Datum object from generated sources from the blueprint
    const datum : Datum = {
        DatumDatum: {
            owner: signerHash
        }
    }
    // Using the generated function to convert the Datum object to Data
    const meshJSData = toMeshJSData(datum);

    const txBuilder = new MeshTxBuilder({
        fetcher: blockchainProvider,
        submitter: blockchainProvider
    })

    const assets: Asset[] = [
        {
            unit: "lovelace",
            quantity: "5000000"
        }
    ]


    await txBuilder
        .txOut(scriptAddr, assets)
        .txOutDatumHashValue(meshJSData)
        .changeAddress(walletAddress)
        .selectUtxosFrom(utxos)
        .complete();
    const signedTx = await wallet.signTx(txBuilder.txHex);
    return await wallet.submitTx(signedTx);
}

lockAsset().then(console.log).catch(console.error);