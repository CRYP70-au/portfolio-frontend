import { ConnectButton, CryptoLogos } from "web3uikit";
import Link from "next/link";

export default function Header() {



    return(
        <header class="text-gray-600 body-font">
        <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
            <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <CryptoLogos
                chain="ethereum"
                onClick={function noRefCheck(){}}
                size="48px"
            />
            <span class="ml-3 text-xl">Welcome to My World</span>
            </a>
            <nav class="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
                <Link className="mr-5 hover:text-gray-900" href="/">Home</Link>
                <Link className="mr-5 hover:text-gray-900" href="/simpleswap/liquidity">Add Liquidity</Link>
                <Link className="mr-5 hover:text-gray-900" href="/simpleswap/swap">Swap</Link>
                <Link className="mr-5 hover:text-gray-900" href="/simpleswap/faucet">Faucet</Link>
            </nav>
            <ConnectButton class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
            </ConnectButton>
        </div>
    </header>
    )
}