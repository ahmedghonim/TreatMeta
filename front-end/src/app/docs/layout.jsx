import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: {
    template: '%s | TreatMeta Guide',
    default: 'TreatMeta Guide - Documentation',
  },
  description: 'Comprehensive guide for using TreatMeta meta-analysis data conversion tools. Learn about mean and SD conversions, effect size estimation, combining groups, and more.',
  openGraph: {
    title: 'TreatMeta Guide',
    description: 'Comprehensive documentation for meta-analysis data conversion tools.',
  },
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
      <Search className='bg-white/5 py-4 px-4 mt-4 rounded-lg' />
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