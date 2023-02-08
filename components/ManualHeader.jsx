import { useMoralis } from "react-moralis";
import { useEffect } from "react";



// Hard way!!
export default function Home() {

    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3Load } = useMoralis();

    // No dependecy array - runs when anything renders
    // Empty dependency array - runs once
    // Populated dep array - runs when that value renders
    useEffect(() => {
        if(isWeb3Enabled){
            if(typeof window !== undefined){
                if(window.localStorage.getItem("connected")){
                    enableWeb3();
                }
            }
            return;
        }
    }, [isWeb3Enabled]);

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to $account}`)
            if(account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3();
                console.log("Null account found")

            }
        })
    })

    return(<div>
        {account ? (
            <div>
                Connected to: {account.slice(0, 6)}...{account.slice(-4)}
            </div>
        ) : (
            <button onClick={async () => {
                await enableWeb3()
                if(window !== undefined){
                    window.localStorage.setItem("connected", "injected")
                }
            }} disabled={isWeb3Load} >Connect</button>
        )}
    </div>);
}