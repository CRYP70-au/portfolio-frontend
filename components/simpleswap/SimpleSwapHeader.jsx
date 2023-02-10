import { ConnectButton, CodeArea } from "web3uikit";
import Link from "next/link";

export default function Header() {



    return(
        <div>
            <h1>SimpleSwap</h1>
            <ConnectButton/>
            <Link href="/">Home</Link>
            <Link href="/simpleswap/liquidity">Add Liquidity</Link>
            <Link href="/simpleswap/swap">Swap</Link>
            <Link href="/simpleswap/faucet">Faucet</Link>

        </div>
    )
}