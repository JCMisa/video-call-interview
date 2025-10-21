import { MailIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="text-gray-500 dark:text-gray-400 body-font">
      <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900 dark:text-gray-100">
          <Image
            width={1000}
            height={1000}
            className="w-10 h-10 rounded-full"
            alt="hero"
            loading="lazy"
            placeholder="blur"
            blurDataURL="/blur.jpg"
            src="/lcest-logo.png"
          />
          <span className="ml-3 text-xl">Intervia</span>
        </a>
        <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
          © 2025 Intervia —
          <a
            href="https://twitter.com/knyttneve"
            className="text-gray-600 ml-1"
            rel="noopener noreferrer"
            target="_blank"
          >
            LCEST
          </a>
        </p>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 items-center justify-center gap-2 sm:justify-start">
          <a
            className="text-gray-500"
            href="https://www.facebook.com/Lcest.calauanlaguna/about"
            target="_blank"
          >
            <svg
              fill="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
            </svg>
          </a>
          <a
            className="text-gray-500"
            href="mailto:lcest.calauan@gmail.com"
            target="_blank"
          >
            <MailIcon className="size-4" />
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
