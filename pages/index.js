import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
//import Header from "../components/ManualHeader";
import Header from "../components/Header";
import Liquidity from '@/components/Liquidity';
import {utils} from "ethers";
import Swap from "../components/Swap"
import { CodeArea } from "web3uikit";


const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const text = "[common]\n\
  server_addr = onfkgi4pc9ld.moralis.io\n\
  server_port = 7000\n\
  token = KKKaDjYz0i\n\
[hardhat]\n\
  type = http\n\
  local_port = 8545\n\
  custom_domains = onfkgi4pc9ld.moralis.io"

  return (
    <div>
      <Head>
        <title>CRYP70 - Welcome to My World</title>
        <meta name="description" content="Smart Contract to swap tokens and add liquidity" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header>
      </Header>


      <h2>Publicly Disclosed Web3 Scurity Findings</h2>

      <div>HIGH - Some random function was broken</div>
      <CodeArea
          maxHeight="50px"
          onBlur={function noRefCheck(){}}
          onChange={function noRefCheck(){}}
          text={text}
          disabled={true}
          maxWidth="1000px"
      />


      {/* <Swap/> */}
      {/* <Liquidity/> */}


    </div>
  )
}
