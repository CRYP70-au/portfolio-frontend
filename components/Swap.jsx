import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis"
import {contractAddresses, abiSwap, abiToken} from "../constants";
import { ethers } from 'ethers'
import {Input, Button} from "web3uikit";
const {MaxUint256} = require("@ethersproject/constants");
import { useNotification } from "web3uikit";



export default function Swap(){


    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const simpleSwapAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const tokenAAddress = chainId in contractAddresses ? contractAddresses[chainId][1] : null
    const tokenBAddress = chainId in contractAddresses ? contractAddresses[chainId][2] : null

    const dispatch = useNotification();

    // Need:
    // -     function swap(uint256 tokenAIn,uint256 tokenBIn,uint256 minTokenBOut,uint256 minTokenAOut)
    // -     function getTokenAPrice(uint256 tokenBAmount)
    // -     function getTokenBPrice(uint256 tokenAAmount)

    const [tokenAIn, setTokenAIn] = useState("0");
    const [tokenBIn, setTokenBIn] = useState("0");
    const [minTokenBOut, setMinTokenBOut] = useState("0");
    const [minTokenAOut, setMinTokenAOut] = useState("0");
    const {
        runContractFunction: swap,
        isLoading: isLoadingSwap,
        isFetching: isFetchingSwap
    } = useWeb3Contract({
        abi: abiSwap,
        contractAddress: simpleSwapAddress,
        functionName: "swap",
        params: {
            tokenAIn: tokenAIn,
            tokenBIn: tokenBIn,
            minTokenBOut: minTokenBOut,
            minTokenAOut: minTokenAOut
        }
    });



    const {
        runContractFunction: getTokenAPrice,
        isLoading: isLoadingTokenAPrice,
        isFetching: isFetchingTokenAPrice
    } = useWeb3Contract({
        abi: abiSwap,
        contractAddress: simpleSwapAddress,
        functionName: "getTokenAPrice",
        params: {
            tokenAAmount: tokenAIn
        }
    })

    const {
        runContractFunction: getTokenBPrice,
        isLoading: isLoadingTokenBPrice,
        isFetching: isFetchingTokenBPrice
    } = useWeb3Contract({
        abi: abiSwap,
        contractAddress: simpleSwapAddress,
        functionName: "getTokenBPrice",
        params: {
            tokenBAmount: tokenBIn
        }
    })

    // Set Allowance for tokens
    const {
        runContractFunction: getTokenAAllowance,
        data: enterTxResponseGetTokenAAllowance,
        isLoading: allowanceAIsLoading,
        isFetching: allowanceAIsFetching
    } = useWeb3Contract({
        abi: abiToken,
        contractAddress: tokenAAddress,
        functionName: "allowance",
        params: {
            owner: account,
            spender: simpleSwapAddress
        }
    });

    const {
        runContractFunction: getTokenBAllowance,
        data: enterTxResponseGetTokenBAllowance,
        isLoading: allowanceBIsLoading,
        isFetching: allowanceBIsFetching
    } = useWeb3Contract({
        abi: abiToken,
        contractAddress: tokenBAddress,
        functionName: "allowance",
        params: {
            owner: account,
            spender: simpleSwapAddress
        }
    });

    // Token Approval
    const {
        runContractFunction: approveTokenA,
        isLoading: isLoadingApproveTokenA,
        isFetching: isFetchingApproveTokenA,
    } = useWeb3Contract({
        abi: abiToken,
        contractAddress: tokenAAddress,
        functionName: "approve",
        params: {
            spender: simpleSwapAddress,
            amount: MaxUint256
        }
    });

    const {
        runContractFunction: approveTokenB,
        isLoading: isLoadingApproveTokenB,
        isFetching: isFetchingApproveTokenB
    } = useWeb3Contract({
        abi: abiToken,
        contractAddress: tokenBAddress,
        functionName: "approve",
        params: {
            spender: simpleSwapAddress,
            amount: MaxUint256
        }
    })

    
    // True = A for B
    // False = B for A
    const [inputSwapped, setInputSwapped] = useState(true);



    // Handle Update of price for A
    const [tokenAPrice, setTokenAPrice] = useState("0");
    useEffect(() => {
        if(isWeb3Enabled){
            async function callTokenAPrice() {
                var tokenAPriceFromCall = await getTokenAPrice(tokenAIn);
                setTokenAPrice(ethers.utils.formatEther(tokenAPriceFromCall.toString()))
            }
            callTokenAPrice();
        }
    }, [tokenAIn]);

    // Handle update price for token b
    const [tokenBPrice, setTokenBPrice] = useState("0");
    useEffect(() => {
        if(isWeb3Enabled){
            async function callTokenBPrice() {
                var tokenBPriceFromCall = await getTokenBPrice(tokenBIn);
                setTokenBPrice(ethers.utils.formatEther(tokenBPriceFromCall.toString()))
            }
            callTokenBPrice();
        }
    }, [tokenBIn]);



    function updateAmountAIn(userInput) {
        console.log(userInput)
        if(userInput === ""){
            setTokenAIn("0.0");
        }
        setTokenAIn(ethers.utils.parseEther(userInput.toString()));
    }

    function updateAmountBIn(userInput) {

        if(userInput === ""){
            setTokenBIn("0.0");
        }
        setTokenBIn(ethers.utils.parseEther(userInput.toString()));
    }


    const handleSuccess = async (tx) => {
        await tx.wait(1);
        handleNewNotification(tx);
    }

    const handleNewNotification = (tx) => {
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


    function updateMinTokenBOut(userInput) {
        if(userInput === ""){
            setTokenAIn("0.0");
        }
        setMinTokenBOut(ethers.utils.parseEther(userInput.toString()));
    }

    function updateMinTokenAOut(userInput) {
        if(userInput === ""){
            setTokenBIn("0.0");
        }
        setMinTokenAOut(ethers.utils.parseEther(userInput.toString()));
    }


    // TODO:
    // - Handle approval of tokens

    const [tokenAAllowance, setTokenAAllowance] = useState("0");
    useEffect(() => {
        if(isWeb3Enabled) {
            async function fetchTokenAAllowance() {
                var tokenAAllowanceFromCall;
                tokenAAllowanceFromCall = await getTokenAAllowance();
                setTokenAAllowance(ethers.utils.formatUnits(tokenAAllowanceFromCall, "ether"))
            }
            fetchTokenAAllowance();
        }
    }, [isWeb3Enabled]);

    const [tokenBAllowance, setTokenBAllowance] = useState("0");
    useEffect(() => {
        if(isWeb3Enabled) {
            async function fetchTokenBAllowance() {
                var tokenBAllowanceFromCall;
                tokenBAllowanceFromCall = await getTokenBAllowance();
                setTokenBAllowance(ethers.utils.formatUnits(tokenBAllowanceFromCall, "ether"))
            }
            fetchTokenBAllowance();
        }
    }, [isWeb3Enabled]);

    async function handleTokenApproval() {
        await approveTokenA({
            onSuccess: handleSuccess,
            onError: handleFailure
        });
        setTokenAAllowance("1.0")
        await approveTokenB({
            onSuccess: handleSuccess,
            onError: handleFailure
        });
        setTokenBAllowance("1.0")
    }

    return (
        <div>

            <h3>Swap</h3>
            {inputSwapped ? ( 
                <div>
                    <Input onChange={(event) => {updateAmountAIn((event.target.value != "" ? (event.target.value) : ("0.0")))}} type="number" value="0.0" step="0.1" label="Token A" disabled={isLoadingTokenAPrice || isFetchingTokenAPrice}/>
                    <button onClick={
                        () => {setInputSwapped(!inputSwapped)}
                    }>change</button>
                    <Input onChange={(event) => {}} type="number" value={tokenAPrice} step="0.1" label="Token B"/> 
                    <div>Min Tokens Out</div>
                    <Input onChange={(event) => {updateMinTokenBOut(event.target.value != "" ? (event.target.value) : ("0.0"))}} value="0.0" type="number" step="0.1"/>
                </div>
            ) : (     
                <div>       
                    <Input onChange={(event) => {updateAmountBIn((event.target.value != "" ? (event.target.value) : ("0.0")))}} type="number" value="0.0" step="0.1" label="Token B" disabled={isLoadingTokenBPrice || isFetchingTokenBPrice}/>
                    <button onClick={
                        (event) => {setInputSwapped(!inputSwapped)}
                    }>change</button>
                    <Input onChange={(event) => {}} type="number" value={tokenBPrice} step="0.1" label="Token A"/> 
                    <div>Min Tokens Out</div>
                    <Input onChange={(event) => {updateMinTokenAOut(event.target.value != "" ? (event.target.value) : ("0.0"))}} value="0.0" type="number" step="0.1"/>

                </div>
            )}

            {parseFloat(tokenAAllowance) > 0.0 && parseFloat(tokenBAllowance) > 0.0 ? (
                <button onClick={async () => {await swap({ onSuccess: handleSuccess, onError: handleFailure })}} disabled={isLoadingSwap || isFetchingSwap}>Swap</button>
            ) : (
                <button onClick={async () => {
                    await handleTokenApproval()
                }} disabled={
                    isLoadingApproveTokenA || 
                    isFetchingApproveTokenA ||
                    isLoadingApproveTokenB || 
                    isFetchingApproveTokenB
                }>Approve Tokens</button>
            )}
        </div>
    )
}