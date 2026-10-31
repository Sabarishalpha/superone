import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
<<<<<<< HEAD
import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
=======
import { ArrowLeft, ArrowRight } from "lucide-react";
>>>>>>> origin/main

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ImageGallery from "../../components/ImageGallery";
<<<<<<< HEAD

import { SERVICES } from "../../data/services";
=======
import { notFound } from "next/navigation";

import { getServices } from "@/lib/content";
>>>>>>> origin/main

type ServicePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

<<<<<<< HEAD
export function generateStaticParams() {
  return SERVICES.map((service) => ({
    slug: service.slug,
  }));
}
=======
export const dynamic = "force-dynamic";
>>>>>>> origin/main

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;

<<<<<<< HEAD
  const service = SERVICES.find(
    (item) => item.slug === slug
  );
=======
  const service = (await getServices()).find((item) => item.slug === slug);
>>>>>>> origin/main

  return {
    title: service
      ? `${service.title} | Orchid Interiors`
      : "Service | Orchid Interiors",

    description: service?.description,
<<<<<<< HEAD
  };
}

export default async function ServiceDetailPage({
  params,
}: ServicePageProps) {
  const { slug } = await params;

  const service = SERVICES.find(
    (item) => item.slug === slug
  );

  if (!service) {
    return null;
=======
    alternates: { canonical: `/services/${slug}` },
    openGraph: service ? { images: [service.image] } : undefined,
    twitter: service ? { images: [service.image] } : undefined,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;

  const service = (await getServices()).find((item) => item.slug === slug);

  if (!service) {
    notFound();
>>>>>>> origin/main
  }

  return (
    <>
      {/* ====================================================
          NAVBAR
      ==================================================== */}

      <Navbar />

<<<<<<< HEAD
      <main className="bg-stone-50 pt-24">

=======
      <main className="bg-stone-50 pt-16">
>>>>>>> origin/main
        {/* ==================================================
            HERO
        ================================================== */}

        <section
          className="
            mx-auto
            grid
            max-w-7xl
            gap-10
            px-4
<<<<<<< HEAD
            py-12
            sm:px-6
            md:px-10
            md:py-20
            lg:grid-cols-[0.9fr_1.1fr]
            lg:items-center
            lg:px-16
            lg:py-24
          "
        >
          <div>

=======
            py-8
            sm:px-6
            md:px-10
            md:py-12
            lg:grid-cols-[0.9fr_1.1fr]
            lg:items-center
            lg:px-16
            lg:py-16
          "
        >
          <div>
>>>>>>> origin/main
            {/* Back */}

            <Link
              href="/services"
              className="
                mb-12
                inline-flex
                items-center
                gap-2
                text-xs
                tracking-[0.2em]
                text-stone-600
                uppercase
                transition-colors
                hover:text-black
              "
            >
              <ArrowLeft className="h-4 w-4" />
<<<<<<< HEAD

=======
>>>>>>> origin/main
              All services
            </Link>

            {/* Number */}

            <p
              className="
                mb-5
                text-xs
                tracking-[0.3em]
                text-stone-500
                uppercase
              "
            >
              {service.number}
              {" / "}
              ORCHID INTERIORS
            </p>

            {/* Title */}

            <h1
              className="
                max-w-xl
                text-5xl
                leading-[1.05]
                font-light
                text-black
                sm:text-6xl
              "
            >
              {service.title}
            </h1>

            {/* Description */}

            <p
              className="
                mt-7
                max-w-lg
                text-lg
                leading-8
                text-stone-700
              "
            >
              {service.detail}
            </p>

            {/* CTA */}

            <Link
              href="/contact"
              className="
                mt-9
                inline-flex
                items-center
                gap-3
                bg-black
                px-7
                py-3.5
                text-sm
                text-white
                transition-colors
                hover:bg-stone-800
              "
            >
              Discuss your project
<<<<<<< HEAD

=======
>>>>>>> origin/main
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Hero image */}

          <div
            className="
              relative
              aspect-16/10
              overflow-hidden
              bg-stone-200
            "
          >
            <Image
              src={service.image}
              alt={service.title}
              fill
              priority
              className="object-cover"
              sizes="
                (max-width: 1024px) 100vw,
                55vw
              "
            />
          </div>
        </section>

<<<<<<< HEAD
=======
        {service.video ? (
          <section className="bg-stone-50 px-4 pb-12 sm:px-6 md:px-10 lg:px-16 lg:pb-16">
            <div className="mx-auto max-w-7xl overflow-hidden bg-black">
              <video
                className="aspect-video w-full object-cover"
                controls
                controlsList="nodownload"
                muted
                playsInline
                preload="metadata"
              >
                <source src={service.video} />
                Your browser does not support the video tag.
              </video>
            </div>
          </section>
        ) : null}

>>>>>>> origin/main
        {/* ==================================================
            APPROACH
        ================================================== */}

        <section
          className="
            border-t
            border-stone-300
            bg-white
            px-4
<<<<<<< HEAD
            py-16
            sm:px-6
            md:px-10
            lg:px-16
            lg:py-20
=======
            py-12
            sm:px-6
            md:px-10
            lg:px-16
            lg:py-16
>>>>>>> origin/main
          "
        >
          <div
            className="
              mx-auto
              grid
              max-w-7xl
              gap-8
              md:grid-cols-3
            "
          >
            <div>
              <p
                className="
                  text-xs
                  tracking-[0.25em]
                  text-stone-500
                  uppercase
                "
              >
                OUR APPROACH
              </p>

              <h2
                className="
                  mt-4
                  text-3xl
                  font-light
                  text-black
                "
              >
<<<<<<< HEAD
                Designed around your way of
                living.
=======
                Designed around your way of living.
>>>>>>> origin/main
              </h2>
            </div>

            <p
              className="
                text-sm
                leading-7
                text-stone-700
              "
            >
<<<<<<< HEAD
              Every project starts with listening.
              We balance your brief, the architecture
              and the details that make a space feel
              unmistakably yours.
=======
              Every project starts with listening. We balance your brief, the
              architecture and the details that make a space feel unmistakably
              yours.
>>>>>>> origin/main
            </p>

            <p
              className="
                text-sm
                leading-7
                text-stone-700
              "
            >
<<<<<<< HEAD
              From concept and material selection to
              execution, our team keeps the process
              clear, considered and personal.
=======
              From concept and material selection to execution, our team keeps
              the process clear, considered and personal.
>>>>>>> origin/main
            </p>
          </div>
        </section>

        {/* ==================================================
            IMAGE GALLERY
        ================================================== */}

        <section
          className="
            bg-stone-50
            px-4
<<<<<<< HEAD
            py-16
            sm:px-6
            md:px-10
            lg:px-16
            lg:py-24
          "
        >
          <div className="mx-auto max-w-7xl">

=======
            py-12
            sm:px-6
            md:px-10
            lg:px-16
            lg:py-16
          "
        >
          <div className="mx-auto max-w-7xl">
>>>>>>> origin/main
            {/* Heading */}

            <div
              className="
                mb-10
                flex
                flex-col
                justify-between
                gap-4
                sm:flex-row
                sm:items-end
              "
            >
              <div>
                <p
                  className="
                    mb-4
                    text-xs
                    tracking-[0.28em]
                    text-stone-500
                    uppercase
                  "
                >
                  SELECTED DETAILS
                </p>

                <h2
                  className="
                    text-3xl
                    font-light
                    text-black
                    sm:text-4xl
                  "
                >
                  A closer look at our work.
                </h2>
              </div>

              <p
                className="
                  max-w-sm
                  text-sm
                  leading-6
                  text-stone-600
                "
              >
<<<<<<< HEAD
                Materials, proportions and moments
                that bring each design direction to
                life.
=======
                Materials, proportions and moments that bring each design
                direction to life.
>>>>>>> origin/main
              </p>
            </div>

            {/* Interactive Gallery */}

<<<<<<< HEAD
            <ImageGallery
              images={service.gallery}
              title={service.title}
            />

=======
            <ImageGallery images={service.gallery} title={service.title} />
>>>>>>> origin/main
          </div>
        </section>
      </main>

      {/* ====================================================
          FOOTER
      ==================================================== */}

      <Footer />
    </>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/main
