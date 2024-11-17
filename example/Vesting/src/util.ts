import {applyParamsToScript, BlockfrostProvider, MeshWallet, serializePlutusScript} from "@meshsdk/core";


export function getWallet(wallet_mnemonic : string[], blockchainProvider : BlockfrostProvider ) {
    return new MeshWallet({
        networkId: 0,
        fetcher: blockchainProvider,
        submitter: blockchainProvider,
        key: {
            type: "mnemonic",
            words: wallet_mnemonic
        }
    });
}

export function getScript(
    blueprintCompiledCode: string,
    params: string[] = [],
    version: "V1" | "V2" | "V3" = "V3"
) {
    const scriptCbor = applyParamsToScript(blueprintCompiledCode, params);

    const scriptAddr = serializePlutusScript(
        {code: scriptCbor, version: version},
        undefined,
        0
    ).address;

    return {scriptCbor, scriptAddr};
}

export async function getWalletInfoForTx(wallet : MeshWallet) {
    const utxos = await wallet.getUtxos();
    const collateral = (await wallet.getCollateral())[0];
    const walletAddress = await wallet.getChangeAddress();

    if (!utxos || utxos?.length === 0) {
        throw new Error("No utxos found");
    }
    if (!collateral) {
        throw new Error("No collateral found");
    }
    if (!walletAddress) {
        throw new Error("No wallet address found");
    }
    return { utxos, collateral, walletAddress };
}