import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis"
import {contractAddresses, abiSwap, abiToken} from "../../constants";
import { ethers } from 'ethers'
import {Input} from "web3uikit";
const {MaxUint256} = require("@ethersproject/constants");
import { useNotification } from "web3uikit";
import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { PolarArea } from 'react-chartjs-2';
  

export default function Liquidity() {


    // Reference: https://github.com/MoralisWeb3/react-moralis
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const simpleSwapAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    console.log(simpleSwapAddress)
    const tokenAAddress = chainId in contractAddresses ? contractAddresses[chainId][1] : null
    const tokenBAddress = chainId in contractAddresses ? contractAddresses[chainId][2] : null

    ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

    const dispatch = useNotification(); 

    const {runContractFunction : getLPBalance} = useWeb3Contract({
        abi: abiSwap,
        contractAddress: simpleSwapAddress,
        functionName: "getLPBalance", 
        params: {}
    })


    // Contract definitions

    // Add Liquidity
    const [amountA, setAmountA] = useState("0");
    const [amountB, setAmountB] = useState("0");

    const {
        runContractFunction: addSwapLiquidity,
        data: enterTxResponseAddLiquidity,
        isLoading: addLiquidityIsLoading,
        isFetching: addLiquidityIsFetching,
    } = useWeb3Contract({
        abi: abiSwap,
        contractAddress: simpleSwapAddress,
        functionName: "addLiquidity",
        params: {
            amountA: amountA,
            amountB: amountB,
            deadline: 9999999999999 // TODO
        }
    });


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


    // LP Token Balance
    const lpProvider = account;
    const [lpBalance, setLPBalance] = useState("0");
    const {
        runContractFunction: getLPTokenBalance,
        isLoading: isLoadingLPBalance,
        isFetching: isFetchingLPBalance
    } = useWeb3Contract({
        abi: abiSwap,
        contractAddress: simpleSwapAddress,
        functionName: "balanceOf",
        params: {
            account: lpProvider
        }
    })

    // Remove Liquidity
    const [tokenAOut, setTokenAOut] = useState("0");
    const [tokenBOut, setTokenBOut] = useState("0");
    const {
        runContractFunction: removeTokenLiquidity,
        isLoading: isLoadingRemovingLiquidity,
        isFetching: isFetchingRemovingLiquidity
    } = useWeb3Contract({
        abi: abiSwap,
        contractAddress: simpleSwapAddress,
        functionName: "removeLiquidity",
        params: {
            tokenAOut: tokenAOut,
            tokenBOut: tokenBOut,
            deadline: 9999999999999 // TODO
        }
    })

    // Approve usage of liquidity tokens
    const {
        runContractFunction: lpApprove,
        isLoading: isLoadingApproveLP,
        isFetching: isFetchingApproveLP,
    } = useWeb3Contract({
        abi: abiSwap,
        contractAddress: simpleSwapAddress,
        functionName: "approve",
        params: {
            spender: simpleSwapAddress,
            amount: MaxUint256
        }
    });


    // Query approval amount for liquidity tokens
    const {
        runContractFunction: getLPAllowance,
        data: enterTxResponseGetLPAllowance,
        isLoading: allowanceLPIsLoading,
        isFetching: allowanceLPIsFetching
    } = useWeb3Contract({
        abi: abiSwap,
        contractAddress: simpleSwapAddress,
        functionName: "allowance",
        params: {
            owner: account,
            spender: simpleSwapAddress
        }
    });


    // Query pool balances
    const [totalBalanceA, setTotalBalanceA] = useState("0");
    const {
        runContractFunction: getPoolBalanceA,
        data: enterTxResponseGetPoolBalance,
        isLoading: isLoadingPoolBalanceA,
        isFetching: isFetchingPoolBalanceA
    } = useWeb3Contract({
        abi: abiSwap,
        contractAddress: simpleSwapAddress,
        functionName: "getTokenABalance",
        params: {}
    })

    const [totalBalanceB, setTotalBalanceB] = useState("0");
    const {
        runContractFunction: getPoolBalanceB,
        isLoading: isLoadingPoolBalanceB,
        isFetching: isFetchingPoolBalanceB
    } = useWeb3Contract({
        abi: abiSwap,
        contractAddress: simpleSwapAddress,
        functionName: "getTokenBBalance",
        params: {}
    })


    // State changes

    const [tokenABalance, setTokenABalance] = useState("0"); // Saves tokenABalance to the state and we can set it again with setTokenABalance
    const [tokenBBalance, setTokenBBalance] = useState("0");

    async function updateUIBalances() {
        try {
            var tokenABalanceFromCall;
            var tokenBBalanceFromCall;
            [tokenABalanceFromCall, tokenBBalanceFromCall] = await getLPBalance(); // Tokens
            setTokenABalance(ethers.utils.formatUnits(tokenABalanceFromCall, "ether"));
            setTokenBBalance(ethers.utils.formatUnits(tokenBBalanceFromCall, "ether"));
    
            var lpBalanceFromCall = await getLPTokenBalance(); // Liquidity provider tokens
            setLPBalance(ethers.utils.formatUnits(lpBalanceFromCall, "ether"));
    
            // Update pool balances
    
            var totalBalanceAFromCall = await getPoolBalanceA();
            setTotalBalanceA(ethers.utils.formatUnits(totalBalanceAFromCall, "ether"));
    
            var totalBalanceBFromCall = await getPoolBalanceB();
            setTotalBalanceB(ethers.utils.formatUnits(totalBalanceBFromCall, "ether"));
        } catch(error) {
            console.log(error);
        }

    }      
    useEffect(() => {
        if(isWeb3Enabled) {
            updateUIBalances();
        }
    },[isWeb3Enabled])



    const [tokenAAllowance, setTokenAAllowance] = useState("0");
    useEffect(() => {
        if(isWeb3Enabled) {
            async function fetchTokenAAllowance() {
                var tokenAAllowanceFromCall;
                try {
                    tokenAAllowanceFromCall = await getTokenAAllowance();
                    setTokenAAllowance(ethers.utils.formatUnits(tokenAAllowanceFromCall, "ether"))
                } catch(error) {
                    console.log(error)
                    console.log("SimpleSwap contracts unreachable!")
                }

            }
            fetchTokenAAllowance();
        }
    }, [isWeb3Enabled]);

    const [tokenBAllowance, setTokenBAllowance] = useState("0");
    useEffect(() => {
        if(isWeb3Enabled) {
            async function fetchTokenBAllowance() {
                var tokenBAllowanceFromCall;
                try {
                    tokenBAllowanceFromCall = await getTokenBAllowance();
                    setTokenBAllowance(ethers.utils.formatUnits(tokenBAllowanceFromCall, "ether"))
                } catch(error) {
                    console.log(error)
                    console.log("SimpleSwap contracts unreachable!")
                }

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
    

    
    const [lpAllowance, setLPAllowance] = useState("0");
    async function fetchLPAllowance() {
        try {
            var lpAllowanceFromCall = await getLPAllowance();
            setLPAllowance(ethers.utils.formatUnits(lpAllowanceFromCall, "ether"))
        } catch(error) {
            console.log(error)
            console.log("SimpleSwap contracts unreachable!")
        }

    }
    async function handleLPApproval() {
        await lpApprove({onSuccess: handleSuccess, onError: handleFailure});
        setLPAllowance("1.0")
    }
    useEffect(() => {
        if(isWeb3Enabled){
            fetchLPAllowance();
        }
    }, [isWeb3Enabled]);


    // Handle user input for adding liquidity
    function updateAmountA(userInput){
        if(userInput === "") { // Handle empty string error
            userInput = "0.0"
        }
        setAmountA(ethers.utils.parseEther(userInput.toString()))
    }
    function updateAmountB(userInput){
        if(userInput === "") {
            userInput = "0.0"
        }
        setAmountB(ethers.utils.parseEther(userInput.toString()))
    }

    // Handle user input for removing liquidity
    function updateAOut(userInput){
        if(userInput === "") {
            userInput = "0.0"
        }
        setTokenAOut(ethers.utils.parseEther(userInput.toString()))
    }
    function updateBOut(userInput) {
        if(userInput === "") {
            userInput = "0.0"
        }
        setTokenBOut(ethers.utils.parseEther(userInput.toString()));
    }


    const handleSuccess = async (tx) => {
        await tx.wait(1);
        await updateUIBalances()
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
        var message = "";
        if(tx.data){
            message = `Transaction Failure!\n${tx.data.message}`    
        } 
        else {
            message = "Transaction Rejected!"
        }
        dispatch({
            type: "error",
            message: message,
            title: "Tx Notification",
            position: "topR"
        })
    }

    const chartData = {
        labels: ['Token A', 'Token B'],
        datasets: [
          {
            label: 'Liquidity',
            data: [totalBalanceA, totalBalanceB],
            backgroundColor: [
              'rgba(54, 162, 235, 0.5)',
              'rgba(153, 102, 255, 0.5)',
            ],
            borderWidth: 1,
          },
        ],
      };
    
    return (
        <section class="text-gray-600 body-font">
            <div class="container px-5 py-24 mx-auto flex flex-wrap">
                <div class="lg:w-1/2 w-full mb-10 lg:mb-0 rounded-lg overflow-hidden">
                    <PolarArea data={chartData} width={700} height={325} options={{ maintainAspectRatio: false }} />
                </div>
                <div class="flex flex-col flex-wrap lg:py-6 -mb-10 lg:w-1/2 lg:pl-12 lg:text-left text-center">

                <div>
                {simpleSwapAddress ? (
                    <div class="flex flex-col flex-wrap lg:py-6 -mb-10 lg:w-1/2 lg:pl-12 lg:text-left text-center">
                        <h3 class="text-gray-900 text-lg title-font font-medium mb-3">Add Liquidity</h3>
                        <div class="flex flex-col flex-wrap lg:py-6 -mb-10 lg:text-left text-center" >
                            <div class="flex mb-10">
                                <Input onChange={(event) => {updateAmountA(event.target.value)}} type="number" value="0" min="0" step="0.1" label="Token A"/>
                            </div>
                            <div class="flex mb-10">
                                <Input onChange={(event) => {updateAmountB(event.target.value)}} type="number" value="0" min="0" step="0.1" label="Token B"/>
                            </div>
                            {parseFloat(tokenAAllowance) > 0.0 && parseFloat(tokenBAllowance) > 0.0 ? (
                                <button class="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded" onClick={async () => { 
                                    await addSwapLiquidity({
                                        onSuccess: handleSuccess,
                                        onError: handleFailure
                                    })
                                }} disabled={addLiquidityIsLoading || addLiquidityIsFetching }>Add liquidity</button>
                            ) : (
                                <button class="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded" onClick={async() => {
                                    await handleTokenApproval();
                                }} disabled={
                                    isLoadingApproveTokenA || 
                                    isFetchingApproveTokenA ||
                                    isLoadingApproveTokenB || 
                                    isFetchingApproveTokenB
                                }>Approve Tokens</button>
                            )}
                        </div>

                        <h3 class="text-gray-900 text-lg title-font font-medium mb-3 mt-20">Remove Liquidity</h3>
                        <div class="flex flex-col flex-wrap lg:py-6 -mb-10 lg:text-left text-center">
                        <div class="flex mb-10">
                            <Input onChange={(event) => {updateAOut(event.target.value)}} type="number" value="0.0" min="0" step="0.1" label="Token A"/>
                        </div>
                        <div class="flex mb-10">
                            <Input onChange={(event) => {updateBOut(event.target.value)}} type="number" value="0.0" min="0" step="0.1" label="Token B"/>
                        </div>
                        {parseFloat(lpAllowance) > 0.0 ? (
                            <button class="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"  onClick={async () => {
                                await removeTokenLiquidity({
                                    onSuccess: handleSuccess,
                                    onError: handleFailure
                                })
                            }} disabled={isLoadingRemovingLiquidity || isFetchingRemovingLiquidity}>Remove Liquidity</button>
                        ) : (
                            <button class="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded" onClick={async () => {
                                await handleLPApproval();
                            }} disabled={isLoadingApproveLP || isFetchingApproveLP}>Approve LP</button>
                        )}
                        </div>
                        
                        <div class="leading-relaxed text-base"> Token A: {tokenABalance} </div> {/* Could do more to make this dynamic by getting symbols, names etc from tokens..*/}
                        <div class="leading-relaxed text-base"> Token B: {tokenBBalance} </div> 
                        <div class="leading-relaxed text-base"> LP Tokens: {lpBalance}</div>
                    </div>

                ) : (
                    <div>No Swap Contract Address Detected</div>
                )}
            </div> 

                </div>
            </div>
            </section>
    )
}