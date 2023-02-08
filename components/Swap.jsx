import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis"
import {contractAddresses, abiSwap, abiToken} from "../constants";
import { ethers } from 'ethers'
import {Input} from "web3uikit";
const {MaxUint256} = require("@ethersproject/constants");
import { useNotification } from "web3uikit";



export default function Swap() {

    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const simpleSwapAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const tokenAAddress = chainId in contractAddresses ? contractAddresses[chainId][1] : null
    const tokenBAddress = chainId in contractAddresses ? contractAddresses[chainId][2] : null

    


    return (
        <div>Hello from swap</div>
    )
}