import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis"
import {contractAddresses, abiSwap, abiToken} from "../constants";
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


    const [lpAllowance, setLPAllowance] = useState("0");
    useEffect(() => {
        if(isWeb3Enabled){
            async function fetchLPAllowance() {
                var lpAllowanceFromCall = await getLPAllowance();
                setLPAllowance(ethers.utils.formatUnits(lpAllowanceFromCall, "ether"))

            }
            fetchLPAllowance();
        }
    }, [isWeb3Enabled])


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

    const chartData = {
        labels: ['Token A', 'Token B'],
        datasets: [
          {
            label: '# of Votes',
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
        <div>
            {simpleSwapAddress ? (
                <div>
                    <h3>Pool Liquidity</h3>
                    <div>Token A Pool Balance: {totalBalanceA}</div>
                    <div>Token B Pool Balance: {totalBalanceB}</div>
                    <div>
                    <PolarArea data={chartData} width={700} height={325} options={{ maintainAspectRatio: false }} />
                    </div>

                    <h3>Add Liquidity</h3>
                    <Input onChange={(event) => {updateAmountA(event.target.value)}} type="number" value="0" min="0" step="0.1" label="Token A"/>
                    <Input onChange={(event) => {updateAmountB(event.target.value)}} type="number" value="0" min="0" step="0.1" label="Token B"/>
                    {parseFloat(tokenAAllowance) > 0.0 && parseFloat(tokenBAllowance) > 0.0 ? (
                        <button onClick={async () => { 
                            await addSwapLiquidity({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error)
                            })
                        }} disabled={addLiquidityIsLoading || addLiquidityIsFetching }>Add liquidity</button>
                    ) : (
                        <button onClick={async() => {
                            await approveTokenA({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error)
                            });
                            await approveTokenB({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error)
                            })
                        }} disabled={
                            isLoadingApproveTokenA || 
                            isFetchingApproveTokenA ||
                            isLoadingApproveTokenB || 
                            isFetchingApproveTokenB
                        }>Approve Tokens</button>
                    )}

                <h3>Remove Liquidity</h3>
                <Input onChange={(event) => {updateAOut(event.target.value)}} type="number" value="0.0" min="0" step="0.1" label="Token A"/>
                <Input onChange={(event) => {updateBOut(event.target.value)}} type="number" value="0.0" min="0" step="0.1" label="Token B"/>
                {parseFloat(lpAllowance) > 0.0 ? (
                    <button onClick={async () => {
                        await removeTokenLiquidity({
                            onSuccess: handleSuccess
                        })
                    }}>Remove Liquidity</button>
                ) : (
                    <button onClick={async () => {
                        await lpApprove({onSuccess: handleSuccess})
                    }}>Approve LP Tokens</button>
                )}
                
                <div> Token A: {tokenABalance} </div> {/* Could do more to make this dynamic by getting symbols, names etc from tokens..*/}
                <div> Token B: {tokenBBalance} </div> 
                <div> LP Tokens: {lpBalance}</div>
                </div>

            ) : (
                <div>No Swap Contract Address Detected</div>
            )}
        </div>
    )
}