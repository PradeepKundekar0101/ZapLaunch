
import { Badge } from './badge'
import { ArrowRight, PlayCircleIcon } from 'lucide-react'

const Hero = () => {
  return (
    <div>
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
    </div>
  )
}

export default Hero