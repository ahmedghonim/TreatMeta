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
import LogoPage from "@/svg/logo";

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
      icon: "🚀",
      list: [
        "Converts various data forms into meta-analysis ready formats",
        "Condenses many steps into just one click",
        "Customizable conversion tables with presets",
        "Advanced techniques: indirect meta-analysis, prevalence & more",
        "Ready for any software - just copy and paste!",
      ],
      description: "Stay tuned for developments in the coming months!",
    },
    {
      src: sImg,
      title: "Manual Conversions",
      icon: "📝",
      description:
        "Initially, we relied on manual conversions by memorizing the equations. However, there were tons of errors, with wasting of time and effort.",
    },
    {
      src: tImg,
      title: "Excel Sheet Era",
      icon: "📊",
      description:
        'This led to the development of an "Excel conversions sheet," collecting crucial conversions:',
      list: [
        "Mean and SE or CI, median and IQR/range to mean and SD",
        "Pre- and post-treatment to mean and SD change",
        "P value or CI of difference to SD for both groups",
      ],
    },
    {
      src: uImg,
      title: "Excel Limitations",
      icon: "⚠️",
      description:
        "Although this sheet improved data preparation, it still required converting data separately for each group, pre-/post-intervention, and conversion by conversion.",
    },
    {
      src: vImg,
      title: "ACR Software",
      icon: "💻",
      description:
        'This led to the "ACR conversions software," condensing 5-10 steps into one:',
      list: [
        "Single-step conversion of various data types to mean and SD",
        "Mean and SD combination for two or more groups",
      ],
    },
    {
      src: fvImg,
      title: "ACR Limitations",
      icon: "🔒",
      description:
        "ACR software enhanced the process, but it converted one study at a time, was Windows-only, and lacked customization features.",
    },
    {
      src: <LogoPage className="size-[200px]" hidname />,
      isSvg: true,
      title: "The Birth of TreatMeta",
      icon: "✨",
      description:
        "All these challenges led to TreatMeta - a comprehensive, accessible, and efficient solution for researchers worldwide.",
    },
  ];

  return (
    <div className="relative py-20 overflow-hidden" id="findmore">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Text variant="stroke-title" className="mb-4">Our Story</Text>
          <p className="text-gray-400 max-w-2xl mx-auto">
            From manual calculations to a comprehensive platform - discover the journey that led to TreatMeta
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Chapter {current}</span>
            <span className="text-sm text-primary font-semibold">{current} / {count}</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(current / count) * 100}%` }}
            />
          </div>
        </div>

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          className="w-full"
          plugins={[
            Autoplay({
              delay: 6000,
              stopOnInteraction: true,
            }),
          ]}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {story.map((item, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col lg:flex-row items-center gap-8 p-4">
                  {/* Image/SVG Section */}
                  <div className="lg:w-1/2 flex justify-center">
                    <div className="relative group">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />

                      <div className="relative bg-gradient-to-br from-[#1e3040] to-[#0f1a24] p-2 rounded-2xl border border-white/10">
                        {item.isSvg ? (
                          <div className="w-[300px] h-[300px] flex items-center justify-center">
                            {item.src}
                          </div>
                        ) : (
                          <Image
                            src={item.src as any}
                            className="object-cover w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] rounded-xl"
                            alt={item.title}
                            width={400}
                            height={400}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="lg:w-1/2 space-y-6">
                    {/* Chapter badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-primary text-sm font-semibold">Chapter {index + 1}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl lg:text-4xl font-bold text-white">
                      {item.title}
                    </h3>

                    {/* Description */}
                    {item.description && (
                      <p className="text-gray-300 text-lg leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {/* List */}
                    {item.list && (
                      <ul className="space-y-3">
                        {item.list.map((listItem, idx) => (
                          <li key={idx} className="flex items-start gap-3 group">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm mt-0.5">
                              ✓
                            </span>
                            <span className="text-gray-300 group-hover:text-white transition-colors">
                              {listItem}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <CarouselPrevious className="relative static translate-x-0 translate-y-0 w-12 h-12 border-2 border-white/20 hover:border-primary hover:bg-primary/10 transition-all" />

            {/* Dots */}
            <div className="flex gap-2">
              {Array.from({ length: count }).map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${current === idx + 1
                      ? 'bg-primary w-8'
                      : 'bg-white/20 hover:bg-white/40'
                    }`}
                  onClick={() => api?.scrollTo(idx)}
                />
              ))}
            </div>

            <CarouselNext className="relative static translate-x-0 translate-y-0 w-12 h-12 border-2 border-white/20 hover:border-primary hover:bg-primary/10 transition-all" />
          </div>
        </Carousel>
      </div>
    </div>
  );
}

export default OurStory;

