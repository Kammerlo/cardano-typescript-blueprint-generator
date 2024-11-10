import {
    applyParamsToScript,
    Asset,
    BlockfrostProvider,
    deserializeAddress,
    MeshTxBuilder,
    MeshWallet,
    serializePlutusScript
} from "@meshsdk/core";
import dotenv from 'dotenv';
// @ts-ignore
import {hello_world, toMeshJSData} from "./generated/hello_world/hello_worlddatum";
// @ts-ignore
import blueprint from "../hello-world/plutus.json";
dotenv.config();

export const blockfrost_api_key = process.env.BLOCKFROST_API_KEY || "";
export const wallet_mnemonic = process.env.MNEMONIC
    ? process.env.MNEMONIC.split(",")
    : "solution,".repeat(24).split(",").slice(0, 24);

function getScript(
    blueprintCompiledCode: string,
    params: string[] = [],
    version: "V1" | "V2" | "V3" = "V3"
) {
    const scriptCbor = applyParamsToScript(blueprintCompiledCode, params);

    const scriptAddr = serializePlutusScript(
        { code: scriptCbor, version: version },
        undefined,
        0
    ).address;

    return { scriptCbor, scriptAddr };
}

const compileCode = blueprint.validators[0].compiledCode;
const { scriptCbor, scriptAddr } = getScript(compileCode);
const blockchainProvider = new BlockfrostProvider(blockfrost_api_key);
const wallet = new MeshWallet({
    networkId: 0,
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
    key: {
        type: "mnemonic",
        words: wallet_mnemonic
    }
});






async function lockAsset() {
    const walletAddress = await wallet.getChangeAddress();
    const utxos = await wallet.getUtxos();
    const signerHash = deserializeAddress(walletAddress).pubKeyHash;
    const datum : hello_world = {
        DatumDatum: {
            owner: signerHash
        }
    }

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

    const meshJSData = toMeshJSData(datum);
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