import { Badge } from "@/components/ui/badge";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { ArrowRight, PlayCircleIcon } from "lucide-react";
import { GlobeContainer } from "@/components/ui/globe";
import { Features } from "@/components/ui/features";

const Landing = () => {
  return (
    <section className="relative">
      <section className="flex items-start flex-col justify-center relative text-center h-full ">
        <div className="blob absolute h-96 w-96 bg-blue-600 blur-3xl opacity-70 top-[-20vh] left-[-20vw]"></div>
        <div className="blob absolute h-96 w-96 bg-blue-600 blur-3xl opacity-10 bottom-[-20vh] right-[-20vw]"></div>
        <Badge text="Introducing Coderbro" />
        <h1 className="text-gradient text-7xl font-semibold text-center w-full">
          Deploy Faster,
          <br /> Analyze Smarter
        </h1>
        <h1 className="text-xl my-4 text-center w-full">
          Deploy your React apps with GitHub integration and track performance
          in real-time, all within a few clicks.
        </h1>
        <div className="flex justify-center items-center w-full space-x-3">
          <button className=" text-white border-white border rounded-md px-10 py-2 text-xl flex items-center">
            <span className=" mr-1 font-thin">Watch Demo</span>
            <PlayCircleIcon />
          </button>
          <button className="bg-white text-black rounded-md px-10 py-2  text-xl flex items-center">
            <span>Deploy your project</span>
            <ArrowRight />
          </button>
        </div>
      </section>
      <section className=" my-10 shadow-md shadow-[#292929] rounded-md  ">
        <img src="/preview.png" />
      </section>

      <section className=" py-6">
        <p className=" text-slate-500 text-center font-thin">Small text</p>
        <h1 className=" text-center text-6xl">Features</h1>
        <Features />
        <GlobeContainer />
      </section>

      <section className=" text-center">
        <p className=" font-thin mb-4">This is small line</p>
        <h1 className=" text-7xl mb-6">FAQs</h1>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
      <section className=" h-[40vh] bg-black"></section>
    </section>
  );
};

export default Landing;
