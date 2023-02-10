import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import Header from "../components/Header";
import { CodeArea } from "web3uikit";
import Link from "next/link";
import BlogLink from "../components/homepage/BlogLink"
import Low from "./images/1.low.jpg"
import Medium from "./images/2.medium.jpg"
import High from "./images/3.high.jpg"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  return (
    <div>
      <Head>
        <title>CRYP70 - Welcome to My World</title>
        <meta name="description" content="Smart Contract to swap tokens and add liquidity" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header>
      </Header>

      <section class="text-gray-600 body-font">

        <div class="container px-5 py-10 mx-auto">
        <div class="py-5">
          <h3 class="title-font font-medium text-lg text-gray-900">Publicly Disclosed Web3 Security Findings</h3>
        </div>
          <div class="flex flex-wrap -m-4">
              <BlogLink 
                name="MEDIUM" 
                description="Code4rena - Caviar - Base tokens in pair contract are assumed to have 1e18 decimals" 
                link="https://github.com/code-423n4/2022-12-caviar-findings/issues/277" 
                image={Medium}/>

              <BlogLink 
                name="MEDIUM" 
                description="Code4rena - Caviar - Flaw in pair contract allows users to get free fractional tokens" 
                link="https://github.com/code-423n4/2022-12-caviar-findings/issues/276"
                image={Medium}/>
              
              <BlogLink 
                name="HIGH" 
                description="Code4rena - Caviar - Critical flaw in providing liquidity results in an immediate loss of funds" 
                link="https://github.com/code-423n4/2022-12-caviar-findings/issues/278"
                image={High}/>
          </div>
          <div class="flex flex-wrap -m-4">
              <BlogLink 
                name="MEDIUM" 
                description="Sherlock - MyCelium - Block future investors from receiving myLink causing a dos condition" 
                link="https://github.com/sherlock-audit/2022-10-mycelium-judging/blob/main/029-M/035.md" 
                image={Medium}/>

              <BlogLink 
                name="MEDIUM" 
                description="Sherlock - MyCelium - Users can be rugged by the admin user" 
                link="https://github.com/sherlock-audit/2022-10-mycelium-judging/blob/main/low-info/008-M/031.md"
                image={Low}/>
              
              <BlogLink 
                name="HIGH" 
                description="Sherlock - Opyn - usdcAmount will be incorrect in WithdrawAuction() when attempting to transfer proportionate amount" 
                link="https://github.com/sherlock-audit/2022-11-opyn-judging/blob/main/008-H/103.md"
                image={High}/>
          </div>
        </div>
      </section>
    </div>
  )
}
