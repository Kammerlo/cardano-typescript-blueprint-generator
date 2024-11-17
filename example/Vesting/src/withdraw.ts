import {
    Asset,
    BlockfrostProvider,
    BuiltinByteString, ConStr0,
    deserializeAddress,
    deserializeDatum, Integer,
    mConStr0,
    MeshTxBuilder, SLOT_CONFIG_NETWORK, unixTimeToEnclosingSlot
} from "@meshsdk/core";
import {getScript, getWallet, getWalletInfoForTx} from "./util";
// @ts-ignore
import dotenv from 'dotenv';
// @ts-ignore
import blueprint from "../vesting-aiken/plutus.json";
import {_redeemer, toMeshJSData} from "./generated/vesting/_redeemer";

dotenv.config();

export type VestingDatum = ConStr0<
    [Integer, BuiltinByteString, BuiltinByteString]
>;

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

const depositTxHash = process.env.DEPOSIT_TX_HASH || "";

async function withdraw() {
    const { utxos, walletAddress, collateral } = await getWalletInfoForTx(wallet);
    const { input: collateralInput, output: collateralOutput } = collateral;
    const { pubKeyHash } = deserializeAddress(walletAddress);

    const depositUtxos = await blockchainProvider.fetchUTxOs(depositTxHash);
    const depositUtxo = depositUtxos[0];
    const datum = deserializeDatum<VestingDatum>(depositUtxo.output.plutusData!);
    const invalidBefore =
        unixTimeToEnclosingSlot(
            Math.min(datum.fields[0].int as number, Date.now() - 15000),
            SLOT_CONFIG_NETWORK.preprod
        ) + 1;

    const redeemer : _redeemer = {}

    await txBuilder
        .spendingPlutusScriptV3()
        .txIn(depositUtxo.input.txHash, depositUtxo.input.outputIndex, depositUtxo.output.amount, scriptAddr)
        .spendingReferenceTxInInlineDatumPresent()
        .spendingReferenceTxInRedeemerValue(toMeshJSData(redeemer))
        .txInScript(scriptCbor)
        .txOut(walletAddress, [])
        .txInCollateral(collateralInput.txHash, collateralInput.outputIndex, collateralOutput.amount, collateralOutput.address)
        .invalidBefore(invalidBefore)
        .requiredSignerHash(pubKeyHash)
        .changeAddress(walletAddress)
        .selectUtxosFrom(utxos)
        .complete();
    const signedTx = await wallet.signTx(txBuilder.txHex);
    return await wallet.submitTx(signedTx);
}

withdraw().then((txHash) => {
    console.log("Transaction submitted with hash: " + txHash);
});