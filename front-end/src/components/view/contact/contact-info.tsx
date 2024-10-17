import { Text } from "@/components/ui/text";
import React from "react";
import X from "@/svg/X";
import Email from "@/svg/email";
import Youtube from "@/assets/svg/youtube";
import Link from "next/link";
import Logo from "@/svg/logo";
function ContactInfo() {
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
    <div className="w-full flex  flex-col bg-[#1E3040] p-8 justify-start relative flex-1 ">
      <div className="space-y-3">
        <Text variant="white" size="te" as="h1">
          We’d Love to Hear from You
        </Text>
        <Text size="base" as="p" className="w-[80%]">
          Have a question, suggestion for a new conversion tool, or need
          assistance with our services? Feel free to reach out to us!
          We&lsquo;re here to help and always open to feedback.{" "}
        </Text>
      </div>

      <div className="pt-8 space-y-3 flex flex-col items-start">
        <Text size="base" className="gap-3">
          <span>
            <Email />
          </span>
          TreatMeta.2024@gmail.com
        </Text>
        {socialData.map((item) =>
          item.link ? (
            <Link
              key={item.name}
              href={item.link}
              className="flex items-center justify-center gap-3 hover:text-primary text-white"
            >
              <item.icon />
              <Text size="sm" className="text-current">
                {item.name}
              </Text>
            </Link>
          ) : (
            <div
              key={item.name}
              className="flex items-center justify-center gap-3 text-white cursor-not-allowed"
            >
              <item.icon />
              <Text size="sm">{item.name}</Text>
              (coming soon!)
            </div>
          )
        )}
      </div>
      <div className="bg-primary absolute flex flex-col items-center justify-center bottom-0 right-0 w-[163px] h-[166px]">
        <Logo color="white" />
      </div>
    </div>
  );
}

export default ContactInfo;
