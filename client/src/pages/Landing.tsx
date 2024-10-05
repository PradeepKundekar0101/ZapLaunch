import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  ArrowRight,
  ChartLineIcon,
  Logs,
  PlayCircleIcon,
  Rocket,
  Settings,
} from "lucide-react";

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
          <button className="bg-white text-black rounded-full px-10 py-2  text-xl flex items-center">
            <span>Deploy your project</span>
            <ArrowRight />
          </button>
        </div>
      </section>
      <section className=" my-10 shadow-md shadow-[#292929] rounded-md  ">
        <img src="/preview.png" />
      </section>

      <section className=" py-20">
        <div className=" text-center">
          <p className=" font-thin mb-4">This is small line</p>
          <h1 className=" text-7xl mb-6">Features Sections</h1>
          <div className=" grid grid-cols-4 gap-3">
            <Card className=" h-40 flex justify-center items-center flex-col relative overflow-hidden">
              <div className="blob absolute h-96 w-96 bg-blue-600 blur-3xl opacity-30 top-[-150px] left-[-140px]"></div>

              <ChartLineIcon className="relative" size={40} />
              <h1 className=" relative text-2xl">Web Analytics</h1>
            </Card>
            <Card className=" h-40 flex justify-center items-center flex-col relative overflow-hidden">
              <div className="blob absolute h-96 w-96 bg-blue-600 blur-3xl opacity-30 top-[-150px] left-[-140px]"></div>

              <Rocket className="relative" size={40} />
              <h1 className=" relative text-2xl">Super Fast</h1>
            </Card>
            <Card className=" h-40 flex justify-center items-center flex-col relative overflow-hidden">
              <div className="blob absolute h-96 w-96 bg-blue-600 blur-3xl opacity-30 bottom-[-150px] right-[-140px]"></div>

              <Logs className="relative" size={40} />
              <h1 className=" relative text-2xl">Realtime logs</h1>
            </Card>
            <Card className=" h-40 flex justify-center items-center flex-col relative overflow-hidden">
              <div className="blob absolute h-96 w-96 bg-blue-600 blur-3xl opacity-30 bottom-[-150px] left-[140px]"></div>

              <Settings className="relative" size={40} />
              <h1 className=" relative text-2xl">Highly customizatable</h1>
            </Card>
          </div>
        </div>
      </section>

      <section className=" h-full my-20">
        <Card className="flex h-[40vh]  justify-between px-10 pr-0 text-center overflow-hidden cdn">
          <div className=" w-1/2 flex flex-col justify-center">
            <h1 className=" text-5xl text-left">Content Delivery Network</h1>
            <p className=" text-left">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius
              tempora sit laboriosam natus, sequi hic doloremque magnam fuga a
              minima provident molestias itaque quisquam eligendi culpa labore
              delectus excepturi odit.
            </p>
          </div>
     
        </Card>
      </section>
      <section className=" text-center my-20">
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
      <section className=" h-[40vh] bg-black">

      </section>
    </section>
  );
};

export default Landing;
