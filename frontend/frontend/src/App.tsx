/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function TopBar({me}: {me: MeInterface | null | undefined}) {
    return (
        <div style={{
            backgroundColor: "#4080ff",
            padding: "4px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
            color: "white"
        }}>
            {me && me.principal &&
                <form method={"post"} action={me.logoutUrl} >
                    <span style={{marginRight: "1em"}}> {me.name} </span>
                    <input type={"hidden"} name={"_csrf"} value={me.xsrfToken} />
                    <button type={"submit"}> Logout </button>
                </form>
            }
            {me && me.principal==null && me.loginUrl &&
                <button onClick={() => window.location.href=me?.loginUrl}> Login </button>
            }
        </div>
    )
}

export interface MeInterface {
    name: string,
    loginUrl: string,
    logoutUrl: string,
    principal: any | null,
    xsrfToken: string
}

function App() {
    const [count, setCount] = useState(0)
    const [data, setData] = useState("")
    const [result, setResult] = useState<any>({})
    const [me, setMe] = useState<MeInterface | null>()

    useEffect(() => {
        const fetchMe = async() =>{
            try{
                const res = await fetch("/me")
                const me = await res.json() as MeInterface
                setMe(me)
            } catch (error){
                setMe(null)
            }
        }
        fetchMe().then()
    }, []);


    return (
    <>
        <TopBar me={me}/>
        <div>
            <a href="https://vitejs.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
            { me && me.principal != null &&
                <div style={{display:"flex", flexDirection:"column"}}>
                    <div style={{border:"dashed 1px gray",
                        padding:"1em",
                        display:"flex",
                        flexDirection:"row",
                        marginBottom: "1em"
                    }}>
                        <input type={"text"} value={data} onChange={e => setData(e.target.value)}/>
                        <button onClick={ () => {
                            const postData = async () => {
                                try {
                                    const res = await fetch("/service_ds/data", {
                                        method: "POST",
                                        headers : [
                                            ["Content-type", "application/json"],
                                            ["X-XSRF-TOKEN", me?.xsrfToken]
                                        ],
                                        body : JSON.stringify({data: data})
                                    })
                                    const result = await res.json()
                                    setResult(result)
                                } catch (error) {
                                    setResult({})
                                }
                            }
                            postData().then()
                        }}> Send </button>
                    </div>
                    <div style={{
                        border: "dashed 1px gray",
                        padding: "1em",
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: "1em"
                    }}>
                        <pre>
                            {JSON.stringify(result, null, 4)}
                        </pre>
                    </div>
                </div>
            }
        </div>
        <p className="read-the-docs">
            Click on the Vite and React logos to learn more
        </p>
    </>
    )
}

export default App
