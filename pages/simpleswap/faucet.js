import Head from 'next/head'
import { Inter } from '@next/font/google'
import Faucet from "../../components/simpleswap/Faucet";
import Header from "../../components/simpleswap/SimpleSwapHeader";


export default function SSFaucet() {

  return (
    <div>
        <Head>
            <title>CRYP70 - Welcome to My World</title>
            <meta name="description" content="Smart Contract to swap tokens and add liquidity" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header/>
        <Faucet/>
        
    </div>
  )
}
