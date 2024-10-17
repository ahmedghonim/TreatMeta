import React from "react";
import Logo from "@/svg/logo";

import { Text } from "@/components/ui/text";
import Link from "next/link";
import Youtube from "@/assets/svg/youtube";
import X from "@/assets/svg/X";
function FooterInfo() {
  const socialData = [
    {
      name: "Youtube",
      icon: Youtube,
      link: "https://www.youtube.com/playlist?list=PLpCgt81286MG4pZBdKm5pLlC9KyEk6us9",
    },

    {
      name: "X",
      icon: X,
    },
  ];
  return (
    <div className="flex flex-col md:flex-row justify-between h-full gap-5">
      <div className="flex flex-col items-start md:w-1/3 gap-5">
        <Link
          href="/"
          className="flex flex-col items-center justify-center text-white font-semibold"
        >
          <Logo width={59} height={55} />
        </Link>
        <Text size={"sm"}>Treat Your Data, Unlock Analytical Potentials</Text>
      </div>

      <div className="flex flex-col items-end justify-between md:w-1/3 h-full ">
        <div className="relative flex flex-col items-end justify-end h-full gap-4">
          {socialData.map((item) =>
            item.link ? (
              <Link
                key={item.name}
                href={item.link}
                className="flex items-center justify-center gap-3 hover:text-primary text-white"
              >
                <Text size="sm" className="text-current">
                  {item.name}
                </Text>
                <item.icon />
              </Link>
            ) : (
              <div
                key={item.name}
                className="flex items-center justify-center gap-3 text-white cursor-not-allowed"
              >
                (coming soon!)
                <Text size="sm">{item.name}</Text>
                <item.icon />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default FooterInfo;
