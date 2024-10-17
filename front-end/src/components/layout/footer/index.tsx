"use client";
import FooterContactUsSection from "./footer-contact-us";
import FooterInfo from "./footer-info";
import CopyRight from "./copy-right";
import { usePathname } from "next/navigation";

function Footer() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col justify-end gap-6 bg-background">
      {pathname !== "/contact-us" && <FooterContactUsSection />}
      <div className="mt-11">
        <FooterInfo />
      </div>

      <div className="md:mt-16 mt-11">
        <CopyRight />
      </div>
    </div>
  );
}

export default Footer;
