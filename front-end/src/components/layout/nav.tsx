"use client";
import React, { useEffect, useState } from "react";
import Logo from "@/svg/logo";
import ArrowRight from "@/svg/arrow-right";
import History from "@/svg/history";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { tabs } from "./chared";
import { usePathname } from "next/navigation";
import { Tooltip } from "react-tooltip";
import useDetectScroll, {
  Axis,
  Direction,
} from "@smakss/react-scroll-direction";
function Nav() {
  const pathname = usePathname();
  const [openSidBar, setOpenSidBar] = useState(false);
  const { scrollDir, scrollPosition } = useDetectScroll();
  const [round, setRound] = useState(false);
  useEffect(() => {
    if (scrollPosition.top > 150) {
      setRound(true);
    } else {
      setRound(false);
    }
  }, [scrollDir, scrollPosition]);

  return (
    <nav
      className={`bg-[#0F182E] layoutPadding fixed top-0 z-40 inset-x-0 md:h-[110px] ease-[cubic-bezier( 0.175, 0.885, 0.32, 1.275 )] duration-700 transform-gpu ${
        round ? "top-[10px] inset-x-[40px] rounded-full" : ""
      }`}
    >
      <div className="grid justify-between w-full grid-cols-12 py-4 mx-auto ">
        <div className="col-span-2 lg:flex lg:items-center lg:gap-12">
          <Link
            href="/"
            className="flex flex-col items-center justify-center text-white font-semibold"
          >
            <span className="sr-only">Home</span>
            <Logo width={56} height={51} />
          </Link>
        </div>

        <nav
          aria-label="Global"
          className="col-span-8  hidden lg:flex items-center w-[90%]"
        >
          <ul className="flex items-center justify-between w-full text-base font-bold text-dark">
            {tabs.map((tab) => (
              <li key={tab.name}>
                <Link
                  className={cn(" transition hover:text-primary", {
                    "text-primary": pathname === tab.href,
                  })}
                  href={tab.href}
                >
                  {tab.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-end lg:col-span-2 col-span-10 gap-4">
          <div className="lg:flex lg:gap-4">
            <div className="hidden lg:flex">
              <Link href="/history" className="flex items-center">
                <History
                  width={24}
                  height={24}
                  data-tooltip-id="history-tooltip"
                  data-tooltip-content="Conversion History"
                />
              </Link>
              <Tooltip id="history-tooltip" />
            </div>
            <div className="hidden lg:flex">
              <Link href="/start">
                <Button>
                  Get Started <ArrowRight />
                </Button>
              </Link>
            </div>
          </div>

          <div className="block lg:hidden">
            <button
              onClick={() => setOpenSidBar(!openSidBar)}
              className="p-2 text-gray-600 transition  rounded "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3 4H21V6H3V4ZM9 11H21V13H9V11ZM3 18H21V20H3V18Z"
                  fill="#B3B8BC"
                />
              </svg>
            </button>
          </div>

          {openSidBar && (
            <div className="block lg:hidden absolute right-0 left-0 top-0 bg-[#0F182E] h-screen z-[100] px-6 py-8 w-full">
              <div className="col-span-2 lg:flex lg:items-center lg:gap-12 flex items-center justify-between">
                <Link href="/" className="block text-teal-600">
                  <span className="sr-only">Home</span>
                  <Logo />
                </Link>
                <button
                  onClick={() => setOpenSidBar(!openSidBar)}
                  className="cursor-pointer active:scale-95 text-white !font-[50px]"
                >
                  X
                </button>
              </div>
              <div className="mt-[57px] flex flex-col gap-4">
                {tabs.map((tab) => (
                  <span
                    key={tab.name}
                    onClick={() => setOpenSidBar(!openSidBar)}
                  >
                    <Link
                      className={cn(
                        " text-[#CCCFD2] font-bold transition hover:text-primary",
                        {
                          "text-primary": pathname === tab.href,
                        }
                      )}
                      href={tab.href}
                    >
                      {tab.name}
                    </Link>
                  </span>
                ))}
              </div>
              <div className="flex mt-6 gap-8">
                <div>
                  <Link href="/start">
                    <Button>
                      Get Started <ArrowRight />
                    </Button>
                  </Link>
                </div>
                <div>
                  <Link href="/history" className="flex items-center">
                    <History width={24} height={24} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
