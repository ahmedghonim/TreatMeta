import { Text } from "@/components/ui/text";
import Link from "next/link";
import React from "react";
import Arrow from "@/svg/right-arrow";
function FooterContactUsSection() {
  return (
    <div className="relative flex justify-between p-8 overflow-hidden bg-opacity-50 rounded-md bg-secondary-foreground mt-10 md:mt-0">
      <div className="flex flex-col items-start md:w-1/2 pb-20 md:pb-0">
        <Text variant="white" size="tee">
          Questions or Suggestions?
        </Text>
        <Text size="sm">
          Have a question, suggestion for a new conversion tool, or need
          assistance with our services? Feel free to reach out to us! We're here
          to help and always open to feedback.
        </Text>
      </div>
      <div className="md:size-[353px] size-[203px] bg-secondary rounded-full absolute right-0 md:top-0 -bottom-[20px] translate-x-[5%] md:-translate-y-[25%] translate-y-[50%] flex md:items-center justify-center">
        <Link href="/contact-us" className="pt-10 md:pt-0">
          <span className="flex items-center gap-2 text-base font-bold text-white hover:scale-105">
            Contact Us
            <span>
              <Arrow />
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}

export default FooterContactUsSection;
