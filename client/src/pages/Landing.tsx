import { GlobeContainer } from "@/components/ui/globe";
import { Features } from "@/components/ui/features";

import FaqAccordion from "@/components/ui/faq-accordin";
import Hero from "@/components/ui/hero";

const Landing = () => {
  return (
    <section className="relative">
      <Hero />
      <section className=" py-6 relative">
        <div className="blob absolute h-96 w-96 bg-blue-600 blur-3xl opacity-20 top-0 right-[-30vw]"></div>
        <div className="blob absolute h-96 w-96 bg-blue-600 blur-3xl opacity-20 bottom-0 left-[-30vw]"></div>
        <div className="blob absolute h-96 w-96 bg-blue-600 blur-3xl opacity-30 bottom-0 left-[-30vw]"></div>
        <p className=" text-slate-300 text-center font-thin">Why ZapLaunch?</p>
        <h1 className=" text-center text-6xl text-gradient1">Features</h1>
        <Features />
        <GlobeContainer />
      </section>

      <section className="text-center my-16">
        <p className="font-thin mb-4 text-slate-300">
          Have questions? We're here to help!
        </p>
        <h1 className="text-7xl mb-6 text-gradient1">FAQs</h1>
        <FaqAccordion />
      </section>
    </section>
  );
};

export default Landing;
