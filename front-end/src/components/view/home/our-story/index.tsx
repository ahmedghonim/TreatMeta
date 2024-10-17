"use client";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import { Text } from "@/components/ui/text";
import Image from "next/image";
import React from "react";
import fImg from "@/assets/img/4.jpg";
import sImg from "@/assets/img/1-1.jpg";
import tImg from "@/assets/img/2.jpg";
import uImg from "@/assets/img/1.jpg";
import vImg from "@/assets/img/3.jpg";
import fvImg from "@/assets/img/5.png";
function OurStory() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const story = [
    {
      src: fImg,
      title: "Why TreatMeta?",
      list: [
        "'TreatMeta' makes it easier to convert various forms of data unsuitable for meta-analyses into formats that can be readily used.",
        "'TreatMeta' condenses many steps and conversions into just one click, allowing for many conversions simultaneously, rather than one by one.",
        "'TreatMeta' allows you to customize your conversions table as you prefer, as well as some pre-formulated presets. ",
        "'TreatMeta' offers advanced analytical techniques such as indirect meta-analysis, prevalence meta-analysis, and much more!",
        "'TreatMeta' converts and organizes your data to be ready for any meta-analysis software; just copy and paste!",
      ],
      description: " Stay tuned for developments in the coming months!",
    },
    {
      src: sImg,
      title: "Manual conversions",
      description:
        "Initially, we relied on manual conversions by memorizing the equations. However, there were tons of errors, with wasting of time and effort. ",
    },
    {
      src: tImg,
      title: "Excel conversions sheet",
      description:
        'This led to the development of an "Excel conversions sheet," collecting crucial conversions for meta-analysis data preparation such as:',
      list: [
        " Mean and SE or CI, median and IQR or range to [mean and SD]. ",
        "Pre- and post-treatment data to [mean and SD change with correlation coefficient]. ",
        "P value or CI of difference between groups to [SD for both groups].",
      ],
    },
    {
      src: uImg,
      title: "Excel sheet limitations",
      description:
        "Although this sheet significantly improved data preparation, it still required converting data for individual groups (intervention and control) separately, as well as pre- and post-intervention data, and conversion by conversion. This was time-consuming and increased the potential for errors.",
    },
    {
      src: vImg,
      title: "ACR conversions software",
      description:
        'This led to the development of the "ACR conversions software," which condenses 5-10 steps into one, allowing for:',
      list: [
        " Single-step conversion of various data types to mean and SD.",
        "Adding other conversions such as mean and SD combination for two or more groups.",
      ],
    },
    {
      src: fvImg,
      title: "ACR software limitations",
      description:
        "Although ACR software significantly enhanced the data preparation process, it still convert one study at a time and was limited to Windows users. Also, it was limited in customization features with lacking other important conversions. ",
    },
    {
      src: fvImg,
      title: "The Birth of TreatMeta",
      description:
        "All these challenges, experiences, and limitations led to the development of 'TreatMeta', addressing the previous shortcomings and providing a comprehensive, accessible, and efficient solution for researchers worldwide.",
    },
  ];
  return (
    <div className="relative flex items-center h-screen">
      <div className="z-30 flex-1 w-full space-y-7">
        <Text variant="stroke-title">Our Story</Text>
        <Carousel
          setApi={setApi}
          className="z-20  mx-auto w-[85%]"
          plugins={[
            //@ts-expect-error
            Autoplay({
              delay: 6000,
            }),
          ]}
        >
          <CarouselContent>
            {story.map((item, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col-reverse w-full gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col items-start gap-5 md:max-w-[60%] text-start">
                    <Text variant="white" size="teb">
                      {item.title}
                    </Text>
                    {item.description && (
                      <Text size="tef">{item.description}</Text>
                    )}
                    {item.list && (
                      <ul className="flex flex-col gap-3 !text-start">
                        {item.list.map((item, index) => (
                          <Text
                            as="li"
                            key={index}
                            className="text-start mr-auto"
                          >
                            • {item}
                          </Text>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="md:w-[400px]  h-auto">
                    <Image
                      src={item.src}
                      className="object-cover md:w-[400px] h-[400px] w-full "
                      alt="text logo"
                      width={360}
                      height={526}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <Text className="font-bold bg-primary  text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto">
            {current}/{count}
          </Text>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className="md:w-[325px] w-[180px] absolute md:right-[-118px] -right-6 bg-[#1E3040] h-screen top-0 z-10"></div>
    </div>
  );
}

export default OurStory;
