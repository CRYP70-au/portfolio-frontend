import Head from 'next/head'
import { Inter } from '@next/font/google'
import Header from "../../components/SimpleSwapHeader";
import Swap from "../../components/Swap";


export default function SSSwap() {

  return (
    <div>
        <Head>
            <title>CRYP70 - Welcome to My World</title>
            <meta name="description" content="Smart Contract to swap tokens and add liquidity" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header/>
      <Swap/> 
    </div>
  )
}
