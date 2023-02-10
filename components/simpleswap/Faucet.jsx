import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis"
import {contractAddresses, abiSwap, abiToken} from "../../constants";
import { ethers } from 'ethers'
import {Input, Card, Illustration} from "web3uikit";
const {MaxUint256} = require("@ethersproject/constants");
import { useNotification } from "web3uikit";


export default function Faucet() {

    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const simpleSwapAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const tokenAAddress = chainId in contractAddresses ? contractAddresses[chainId][1] : null
    const tokenBAddress = chainId in contractAddresses ? contractAddresses[chainId][2] : null

    const dispatch = useNotification();

    const {
        runContractFunction: getTokenA,
        isLoading: isLoadingGetTokenA,
        isFetching: isFetchingGetTokenA
    } = useWeb3Contract({
        abi: abiToken,
        contractAddress: tokenAAddress,
        functionName: "drip",
        params: {}
    })

    const {
        runContractFunction: getTokenB,
        isLoading: isLoadingGetTokenB,
        isFetching: isFetchingGetTokenB
    } = useWeb3Contract({
        abi: abiToken,
        contractAddress: tokenBAddress,
        functionName: "drip",
        params: {}
    })


    // Notifications
    const handleSuccess = async (tx) => {
        await tx.wait(1);
        console.log("Tx Hash: " + tx.hash)
        handleNewSuccessNotification(tx);
    }
    const handleNewSuccessNotification = (tx) => {
        dispatch({
            type: "info",
            message: `Transaction Complete!\n${tx.hash}`,
            title: "Tx Notification",
            position: "topR",
        })
    }

    const handleFailure = async (tx) => {
        handleNewFailureNotification(tx)
    }
    const handleNewFailureNotification = (tx) => {
        dispatch({
            type: "error",
            message: `Transaction Failure!\n${tx.data.message}`,
            title: "Tx Notification",
            position: "topR"
        })
    }

    async function handleFaucetDrip() {
        await getTokenA({onSuccess: handleSuccess, onError: handleFailure});
        await getTokenB({onSuccess: handleSuccess, onError: handleFailure});
    }
    
    return (
        <div>
            {tokenAAddress && tokenBAddress ? (
                <div>
                    <div
                        style={{
                            width: '350px'
                        }}
                    >
                    <Card
                        description={`TokenA: ${tokenAAddress}\nTokenB: ${tokenBAddress}`}
                        onClick={function noRefCheck(){}}
                        setIsSelected={function noRefCheck(){}}
                        title="ERC20-Token Faucet"
                        tooltipText="Mint 750 test tokens every 12 hours"
                    >
                        <div>
                        <Illustration
                            height="180px"
                            logo="token"
                            width="100%"
                        />
                        </div>
                    </Card>
                    </div>
                    <button onClick={async () => {handleFaucetDrip()}}>Give me tokens!</button>
                </div>
            ) : (
                <div>No faucet tokens found!</div>
            )}
        </div>
    )

}