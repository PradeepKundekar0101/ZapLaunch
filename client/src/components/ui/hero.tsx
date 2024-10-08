
import { Badge } from '@/components/ui/badge';
import { ArrowRight, PlayCircleIcon } from 'lucide-react';
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div>
      <section className="flex items-start flex-col justify-center relative text-center h-full py-10 ">
        <motion.div 
          className="blob absolute h-96 w-96 bg-blue-600 blur-3xl opacity-70 top-[0vh] left-[-20vw]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1.5 }}
        ></motion.div>
        <motion.div 
          className="blob absolute h-96 w-96 bg-blue-600 blur-3xl opacity-10 bottom-[-20vh] right-[-20vw]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className=' mx-auto'
        >
          <Badge text="Introducing ZapLaunch ⚡" />
        </motion.div>
        <motion.h1 
          className="text-gradient text-7xl font-semibold text-center w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Deploy Faster,
          <br /> Analyze Smarter
        </motion.h1>
        <motion.h1 
          className="text-xl my-7 text-center w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Deploy your React apps with GitHub integration and track performance
          in real-time, all within a few clicks.
        </motion.h1>
        <motion.div 
          className="flex justify-center items-center w-full space-x-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.button 
            className="text-white border-white border rounded-md px-10 py-1 text-xl flex items-center duration-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            
          >
            <span className="mr-1 text-lg font-thin">Watch Demo</span>
            <PlayCircleIcon />
          </motion.button>
          <motion.button 
            className="bg-white text-black rounded-md px-10 py-1 text-xl flex items-center duration-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className=' text-lg font-normal'>Deploy your project</span>
            <ArrowRight />
          </motion.button>
        </motion.div>
      </section>
      <motion.section 
        className="my-10 shadow-md shadow-[#292929] rounded-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <img src="/preview.png" className=' w-full  object-cover' alt="Preview" />
      </motion.section>
    </div>
  )
}

export default Hero;