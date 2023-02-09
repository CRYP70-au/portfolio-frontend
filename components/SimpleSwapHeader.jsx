import { ConnectButton, CodeArea } from "web3uikit";
import Link from "next/link";

export default function Header() {



    return(
        <div>
            <Link href="/">Home</Link>
            <Link href="/simpleswap/liquidity">Add Liquidity</Link>
            <Link href="/simpleswap/swap">Swap</Link>
        </div>
    )
}