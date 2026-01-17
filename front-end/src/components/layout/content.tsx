"use client";

import Footer from "@/components/layout/footer";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { usePathname } from "next/navigation";

export default function Content({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDocsPage = pathname?.startsWith("/docs");

  return (
    <main className="relative overflow-x-hidden layoutPadding">
      <ReactNotifications />

      <div className="fixed w-[479.365px] h-[507.308px] rotate-[12.185deg] blur-[150px] left-10 top-10 -translate-x-1/2  rounded-[507.308px]" />
      {children}
      {!isDocsPage && <Footer />}
    </main>
  );
}
