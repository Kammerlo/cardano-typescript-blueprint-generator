import {BlockfrostProvider, Data, PlutusScript, resolvePaymentKeyHash, Transaction,} from "@meshsdk/core";
// @ts-ignore
import dotenv from 'dotenv';
// @ts-ignore
import blueprint from "../hello-world/plutus.json";
// @ts-ignore
import {getScript, getWallet} from './util';
// @ts-ignore
import * as Datum from "./generated/hello_world/Datum";
// @ts-ignore
import * as Redeemer from "./generated/hello_world/Redeemer";
// @ts-ignore
import cbor from "cbor";

dotenv.config();

export const blockfrost_api_key = process.env.BLOCKFROST_API_KEY || "";
export const wallet_mnemonic = process.env.MNEMONIC
    ? process.env.MNEMONIC.split(",")
    : "solution,".repeat(24).split(",").slice(0, 24);

const blockchainProvider = new BlockfrostProvider(blockfrost_api_key);
const wallet = getWallet(wallet_mnemonic, blockchainProvider);
const compileCode = blueprint.validators[0].compiledCode;
const { scriptCbor, scriptAddr } = getScript(compileCode);

const script = {
    code: cbor
        .encode(Buffer.from(blueprint.validators[0].compiledCode, "hex"))
        .toString("hex"),
    version: "V3",
};

async function unlockAsset(lockHash: string) : Promise<string> {
    // Finding the UTxo which we want to unlock
    const contractUtxos = await blockchainProvider.fetchAddressUTxOs(scriptAddr);
    const lockUtxo = contractUtxos.find(utxo => utxo.input.txHash === lockHash);
    const walletAddress = await wallet.getChangeAddress();
    const walletPaymentKeyHash = resolvePaymentKeyHash(walletAddress);

    const datum : Datum.Datum = {
        DatumDatum: {
            owner: walletPaymentKeyHash
        }
    }
    const redeemer : Redeemer.Redeemer = {
        RedeemerRedeemer: {
            msg: "Hello World"
        }
    }

    const unsignedTx = await new Transaction({initiator: wallet})
        .redeemValue({
            value: lockUtxo!,
            script: script as PlutusScript,
            datum: Datum.toMeshJSData(datum),
            redeemer: {data: Redeemer.toMeshJSData(redeemer)}
        })
        .sendValue(walletAddress, lockUtxo!)
        .setRequiredSigners([walletAddress])
        .build();
    const signedTx = await wallet.signTx(unsignedTx);
    return await wallet.submitTx(signedTx);
}

// Add the txHash of the lock transaction here
const txHash : string = 'ccbad6f410b11bb1885f2a3f10c86af6cb506d74db0dbe11898818df9271bbc9';
unlockAsset(txHash).then(console.log).catch(console.error);

// Example if you want to lock and directly unlock the asset
// lockAsset().then(lockHash => {
//     unlockAsset(lockHash).then(unlockHash => {
//        console.log(unlockHash);
//     });
// });

