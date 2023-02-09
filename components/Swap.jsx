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

    // TODO:
    // - Handle approval of tokens
    // - Create separate box for min amount out

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
                </div>
             ) : (     
                <div>       
                    <Input onChange={(event) => {updateAmountBIn((event.target.value != "" ? (event.target.value) : ("0.0")))}} type="number" value="0.0" step="0.1" label="Token B" disabled={isLoadingTokenBPrice || isFetchingTokenBPrice}/>
                    <button onClick={
                        (event) => {setInputSwapped(!inputSwapped)}
                    }>change</button>
                    <Input onChange={(event) => {}} type="number" value={tokenBPrice} step="0.1" label="Token A"/> 
                </div>
            )}
            
            <button onClick={async () => {await swap({ onSuccess: handleSuccess })}} disabled={isLoadingSwap || isFetchingSwap}>Swap</button>

        </div>
    )
}