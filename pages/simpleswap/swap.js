import Head from 'next/head'
import Header from "../../components/simpleswap/SimpleSwapHeader";
import Swap from "../../components/simpleswap/Swap";


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
