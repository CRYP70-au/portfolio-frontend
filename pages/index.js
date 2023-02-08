import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
//import Header from "../components/ManualHeader";
import Header from "../components/Header";
import Liquidity from '@/components/Liquidity';
import {utils} from "ethers";
import Swap from "../components/Swap"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div>
      <Head>
        <title>Smart Contract Simple Swap</title>
        <meta name="description" content="Smart Contract to swap tokens and add liquidity" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header>
      </Header>
      {/* <Liquidity/> */}
      <Swap/>

    </div>
  )
}
