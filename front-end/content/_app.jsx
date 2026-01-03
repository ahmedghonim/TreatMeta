import Nav from "@/components/layout/nav"
import "@/app/globals.css"

export default function MyApp({ Component, pageProps }) {
  
  return(
    <>
    
   <div className="Docs">
   <Component {...pageProps + <Nav />} />
   </div>
   
    </>
    )
}