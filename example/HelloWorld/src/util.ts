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
        { code: scriptCbor, version: version },
        undefined,
        0
    ).address;

    return { scriptCbor, scriptAddr };
}