import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
 
export const metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
}
 

const navbar = (
  <Navbar
    logo={<b>TreatMeta Guide</b>}
    
  />
)
const footer = <Footer />

 function SearchWithPadding() {
  return (
    <div className={''}>
            <Search className='bg-white/5 py-4 px-4 mt-4 rounded-lg'
    />
    </div>

  )
}
export default async function RootLayout({ children }) {
  return (

        
        <Layout
          
          
          pageMap={await getPageMap("/docs")}
          footer={footer}

        
        >



          
          
          {children}
        </Layout>

  )
}