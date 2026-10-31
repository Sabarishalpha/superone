"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
<<<<<<< HEAD
import { SERVICES } from "../data/services";

export default function Services() {
=======
import { useEffect, useRef } from "react";

type ServiceShape = {
  number: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  gallery: readonly string[];
  detail: string;
};

export default function Services({
  services,
}: {
  services: readonly ServiceShape[];
}) {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const interval = window.setInterval(() => {
      const firstCard = carousel.querySelector<HTMLElement>(
        "[data-service-card]",
      );

      if (!firstCard) return;

      const cardDistance = firstCard.offsetWidth + 24;
      const isAtEnd =
        carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 8;

      carousel.scrollTo({
        left: isAtEnd ? 0 : carousel.scrollLeft + cardDistance,
        behavior: "smooth",
      });
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

>>>>>>> origin/main
  return (
    <section
      id="services"
      data-services-section
      className="
        relative
        w-full
        overflow-hidden
        bg-stone-50
        px-4
<<<<<<< HEAD
        py-20
        sm:px-6
        sm:py-24
        md:px-8
        md:py-28
        lg:px-12
        lg:py-32
=======
        py-10
        sm:px-6
        sm:py-12
        md:px-8
        md:py-14
        lg:px-12
        lg:py-16
>>>>>>> origin/main
        xl:px-16
      "
    >
      {/* =====================================================
          CONTENT CONTAINER
      ====================================================== */}

      <div className="mx-auto max-w-[1600px]">
<<<<<<< HEAD

=======
>>>>>>> origin/main
        {/* =====================================================
            SECTION INTRODUCTION
        ====================================================== */}

        <div
          className="
<<<<<<< HEAD
            mb-14
            text-center
            sm:mb-16
            md:mb-20
            lg:mb-24
=======
            mb-8
            text-center
            sm:mb-10
            md:mb-12
            lg:mb-14
>>>>>>> origin/main
          "
        >
          {/* Label */}

          <p
            data-services-label
            className="
              mb-5
              text-[10px]
              font-medium
              uppercase
              tracking-[0.32em]
              text-stone-600
              sm:mb-6
              sm:text-xs
              md:text-sm
            "
          >
            Our Services
          </p>

          {/* Heading */}

          <h2
            data-services-title
            className="
              mx-auto
<<<<<<< HEAD
              mb-6
=======
              mb-4
>>>>>>> origin/main
              max-w-3xl
              text-4xl
              font-light
              leading-[1.05]
              tracking-[-0.025em]
              text-black
<<<<<<< HEAD
              sm:mb-7
=======
              sm:mb-5
>>>>>>> origin/main
              sm:text-5xl
              md:text-6xl
              lg:text-7xl
            "
          >
            Spaces designed around you.
          </h2>

          {/* Description */}

          <p
            data-services-description
            className="
              mx-auto
              max-w-2xl
              text-sm
              leading-7
              text-stone-700
              sm:text-base
              sm:leading-8
              md:text-lg
            "
          >
            From concept to completion, we create considered interiors that
            combine functionality, craftsmanship and timeless design.
          </p>
        </div>

        {/* =====================================================
            SERVICE CARDS
        ====================================================== */}

<<<<<<< HEAD
        <div
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            sm:gap-6
            lg:grid-cols-3
            lg:gap-7
            xl:grid-cols-5
            xl:gap-6
            2xl:gap-8
          "
        >
          {SERVICES.map((service, index) => (
            <Link
              key={index}
              href={`/services/${service.slug}`}
              data-service-card
              className="
=======
        <div className="relative">
          <div
            ref={carouselRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Our services"
          >
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                data-service-card
                className="
                w-[calc(100vw-2rem)]
                min-w-[calc(100vw-2rem)]
                snap-start
>>>>>>> origin/main
                group
                relative
                flex
                min-h-0
                flex-col
                overflow-hidden
                border
                border-stone-300
                bg-white
                transition-all
                duration-500
                hover:-translate-y-1
                hover:border-stone-400
                hover:shadow-xl
<<<<<<< HEAD
              "
            >
              {/* =================================================
                  SERVICE IMAGE
              ================================================== */}

              <div
                className="
=======
                sm:w-[calc((100vw-3rem)/2)]
                sm:min-w-[calc((100vw-3rem)/2)]
                lg:w-[calc((100%_-_3rem)/3)]
                lg:min-w-[calc((100%_-_3rem)/3)]
              "
              >
                {/* =================================================
                  SERVICE IMAGE
              ================================================== */}

                <div
                  className="
>>>>>>> origin/main
                  relative
                  h-56
                  w-full
                  overflow-hidden
                  bg-stone-200
                  sm:h-64
                  md:h-72
                  lg:h-80
<<<<<<< HEAD
                  xl:h-72
                  2xl:h-80
                "
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="
=======
                  xl:h-80
                "
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="
>>>>>>> origin/main
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-105
                  "
<<<<<<< HEAD
                  sizes="
                    (max-width: 640px) 100vw,
                    (max-width: 1024px) 50vw,
                    (max-width: 1536px) 33vw,
                    20vw
                  "
                />

                {/* Image Overlay */}

                <div
                  className="
=======
                    sizes="
                    (max-width: 640px) 100vw,
                    (max-width: 1024px) 50vw,
                    33vw
                  "
                  />

                  {/* Image Overlay */}

                  <div
                    className="
>>>>>>> origin/main
                    absolute
                    inset-0
                    bg-black/0
                    transition-colors
                    duration-500
                    group-hover:bg-black/5
                  "
<<<<<<< HEAD
                />
              </div>

              {/* =================================================
                  SERVICE CONTENT
              ================================================== */}

              <div
                className="
=======
                  />
                </div>

                {/* =================================================
                  SERVICE CONTENT
              ================================================== */}

                <div
                  className="
>>>>>>> origin/main
                  flex
                  flex-grow
                  flex-col
                  items-center
                  justify-between
                  px-5
                  py-7
                  text-center
                  sm:px-6
                  sm:py-8
                  lg:px-6
                  lg:py-9
                  xl:px-5
                  xl:py-8
                  2xl:px-6
                  2xl:py-9
                "
<<<<<<< HEAD
              >
                {/* Top Content */}

                <div className="flex w-full flex-col items-center">

                  {/* Number */}

                  <span
                    data-service-number
                    className="
=======
                >
                  {/* Top Content */}

                  <div className="flex w-full flex-col items-center">
                    {/* Number */}

                    <span
                      data-service-number
                      className="
>>>>>>> origin/main
                      mb-4
                      text-[10px]
                      font-light
                      tracking-[0.16em]
                      text-stone-500
                      transition-colors
                      duration-300
                      group-hover:text-stone-700
                      sm:text-xs
                    "
<<<<<<< HEAD
                  >
                    {service.number}
                  </span>

                  {/* Title */}

                  <h3
                    data-service-title
                    className="
=======
                    >
                      {service.number}
                    </span>

                    {/* Title */}

                    <h3
                      data-service-title
                      className="
>>>>>>> origin/main
                      mb-4
                      text-lg
                      font-light
                      leading-tight
                      tracking-[-0.01em]
                      text-black
                      sm:text-xl
                      lg:text-[21px]
                    "
<<<<<<< HEAD
                  >
                    {service.title}
                  </h3>

                  {/* Description */}

                  <p
                    data-service-description
                    className="
=======
                    >
                      {service.title}
                    </h3>

                    {/* Description */}

                    <p
                      data-service-description
                      className="
>>>>>>> origin/main
                      max-w-[260px]
                      text-xs
                      leading-6
                      text-stone-600
                      sm:text-sm
                      sm:leading-7
                    "
<<<<<<< HEAD
                  >
                    {service.description}
                  </p>
                </div>

                {/* =================================================
                    ARROW
                ================================================== */}

                <div
                  className="
=======
                    >
                      {service.description}
                    </p>
                  </div>

                  {/* =================================================
                    ARROW
                ================================================== */}

                  <div
                    className="
>>>>>>> origin/main
                    mt-7
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-stone-300
                    transition-all
                    duration-500
                    group-hover:border-black
                    group-hover:bg-black
                  "
<<<<<<< HEAD
                >
                  <ArrowRight
                    data-service-arrow
                    className="
=======
                  >
                    <ArrowRight
                      data-service-arrow
                      className="
>>>>>>> origin/main
                      h-4
                      w-4
                      text-black
                      transition-all
                      duration-500
                      group-hover:translate-x-0.5
                      group-hover:text-white
                    "
<<<<<<< HEAD
                    aria-hidden="true"
                  />
                </div>
              </div>
            </Link>
          ))}
=======
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button
            type="button"
            aria-label="Previous service"
            onClick={() =>
              carouselRef.current?.scrollBy({ left: -360, behavior: "smooth" })
            }
            className="absolute left-5 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/75 text-white transition-colors hover:bg-black sm:left-7 sm:flex"
          >
            <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next service"
            onClick={() =>
              carouselRef.current?.scrollBy({ left: 360, behavior: "smooth" })
            }
            className="absolute right-5 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/75 text-white transition-colors hover:bg-black sm:right-7 sm:flex"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
>>>>>>> origin/main
        </div>
      </div>
    </section>
  );
}
