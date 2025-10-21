import { MapIcon } from "lucide-react";
import Image from "next/image";

const About = async () => {
  return (
    <section id="about" className="text-gray-600 dark:text-gray-300 body-font">
      <h2 className="font-bold text-4xl text-center">About LCEST</h2>
      <div className="container px-5 py-24 mx-auto flex flex-wrap">
        <div className="flex flex-wrap w-full">
          <div className="lg:w-2/5 md:w-1/2 md:pr-10 md:py-6">
            <div className="flex relative pb-12">
              <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                <MapIcon className="size-5" />
              </div>
              <div className="flex-grow pl-4">
                <h2 className="font-medium title-font text-sm text-gray-900 dark:text-gray-100 mb-1 tracking-wider">
                  LOCATION
                </h2>
                <p className="leading-relaxed">
                  2nd and 3rd Floor BOSE Bldg. Maharlika Highway Brgy. Kanluran
                  Calauan Laguna
                </p>
              </div>
            </div>
            <div className="flex relative pb-12">
              <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <div className="flex-grow pl-4">
                <h2 className="font-medium title-font text-sm text-gray-900 dark:text-gray-100 mb-1 tracking-wider">
                  TRACK AND STRANDS
                </h2>
                <p className="leading-relaxed">
                  Mechatronics Servicing NCII / Instumentation and Control
                  Servicing NCII <br />
                  Accountancy Business and Management <br />
                  Bookkeeping NCIII <br />
                  Senior High School <br />
                </p>
              </div>
            </div>
            <div className="flex relative pb-12">
              <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="5" r="3"></circle>
                  <path d="M12 22V8M5 12H2a10 10 0 0020 0h-3"></path>
                </svg>
              </div>
              <div className="flex-grow pl-4">
                <h2 className="font-medium title-font text-sm text-gray-900 dark:text-gray-100 mb-1 tracking-wider">
                  VICE PRESIDENT FOR OPERATIONS
                </h2>
                <p className="leading-relaxed">Shyrell R. Segui</p>
              </div>
            </div>
          </div>
          <Image
            className="lg:w-3/5 md:w-1/2 object-cover object-center rounded-lg md:mt-0 mt-12"
            src="/about-img.jpg"
            width={1200}
            height={500}
            alt="step"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
