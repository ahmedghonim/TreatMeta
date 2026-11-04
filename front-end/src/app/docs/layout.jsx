import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'katex/dist/katex.min.css'

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
    <>
      <link rel="stylesheet" href="/nextra-theme.css" />
      <style>{`
        /* Hide MathML fallback to prevent duplicate equation/symbol rendering */
        .katex-mathml {
          display: none !important;
        }
        /* Ensure all documentation tables are contained and scroll on small viewports */
        article table,
        main table,
        .nextra-content table,
        table {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: auto !important;
          border-collapse: collapse !important;
          margin: 1.5rem 0 !important;
        }
        article th, article td,
        main th, main td,
        .nextra-content th, .nextra-content td,
        th, td {
          padding: 0.65rem 0.85rem !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          font-size: 0.875rem !important;
        }
        article th, main th, .nextra-content th, th {
          background-color: rgba(255, 255, 255, 0.06) !important;
          font-weight: 600 !important;
          white-space: nowrap !important;
        }
        /* Override Nextra CSS for main navbar */
        body > nav {
          background-color: #0F182E !important;
          padding-left: 1rem !important;
          padding-right: 1rem !important;
        }
        body > nav > div {
          padding-top: 1rem !important;
          padding-bottom: 1rem !important;
        }
        body > nav a {
          text-decoration: none !important;
        }
        body > nav ul {
          color: #cccfd2 !important;
        }
        @media (min-width: 1024px) {
          body > nav ul {
            display: flex !important;
            align-items: center !important;
          }
          body > nav {
            padding-left: 2rem !important;
            padding-right: 2rem !important;
          }
        }
        body > nav button,
        body > nav button.bg-primary {
          background-color: #f05445 !important;
          color: white !important;
          padding: 0.75rem 1.5rem !important;
          border-radius: 0.375rem !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          font-weight: 600 !important;
        }
        body > nav .text-primary {
          color: #f05445 !important;
        }
        body > nav .text-dark {
          color: #cccfd2 !important;
        }
        /* Mobile sidebar menu fixes */
        body > nav div.bg-\\[\\#0F182E\\].h-screen {
          padding: 2rem 1.5rem !important;
        }
        /* Fix X close button */
        body > nav div.bg-\\[\\#0F182E\\].h-screen button {
          background-color: transparent !important;
          padding: 0.5rem !important;
        }
      `}</style>
      <Layout
        pageMap={await getPageMap("/docs")}
        footer={footer}
      >
        {children}
      </Layout>
    </>
  )
}