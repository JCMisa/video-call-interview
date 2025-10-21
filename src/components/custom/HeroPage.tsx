import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";

const HeroPage = async () => {
  const user = await currentUser();

  return (
    <section className="text-dark bg-light dark:text-light dark:bg-dark body-font">
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 md:mb-0 mb-10">
          <Image
            width={720}
            height={600}
            className="object-cover object-center rounded"
            alt="hero"
            loading="lazy"
            placeholder="blur"
            blurDataURL="/blur.jpg"
            src="/lcest-logo.png"
          />
        </div>
        <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-black dark:text-white">
            Welcome LCEST Students!
            <br className="hidden lg:inline-block" />
            Streamline your enrollment assessment and interview process
          </h1>
          <p className="mb-8 leading-relaxed">
            Easily manage your enrollment, assessment, and interview steps
            online. Join LCEST&apos;s digital platform for a smoother student
            experience.
          </p>
          <div className="flex justify-center gap-3">
            <Button asChild className="min-w-32 max-w-32">
              <Link href={!user ? "/sign-in" : "/home"}>Get Started</Link>
            </Button>
            <Button asChild className="min-w-32 max-w-32" variant={"outline"}>
              <Link href={"#about"}>Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroPage;
