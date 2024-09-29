import Logo from "@/svg/logo"
import { useRouter } from 'next/router'
import { useConfig } from 'nextra-theme-docs'

export default {
    logo:  <div className="flex flex-col items-center justify-center text-white font-semibold">
              <Logo width={56} height={51} />
            </div>,
    project: {
      link: 'https://github.com/shuding/nextra'
    },
    primaryHue:{dark:5.6, light:80},
    primarySaturation:{dark:85, light:20},
    footer: {
      component:<div></div>
    },
    useNextSeoProps() {
      const { asPath } = useRouter()
      if (asPath !== '/') {
        return {
          titleTemplate: '%s – TreatMeta'
        }
      }
    },
    sidebar: {
      titleComponent({ title, type }) {
        if (title=="Content"){
          return (
            <div >
                <div style={{ fontWeight: "bold", fontSize: 20, marginLeft: 4 }} className="flex items-center w-full text-white">   {title}</div>
            </div>
            
          )
        }
        return (
          <div >
              <div style={{ fontWeight: "bold", fontSize: 16, marginLeft: 4 }} className="flex items-center w-full">   {title}</div>
          </div>
          
        )
      }
    }

  }