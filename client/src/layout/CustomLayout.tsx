import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

function DefaultLayout({ children }: Props) {
  return (
    <motion.main 
      className="flex flex-col min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Navbar />
      </motion.div>
      
      <Toaster />
      
      <motion.section 
        className="flex-grow px-8 max-md:px-8 lg:px-[5vw] xl:px-[10vw] 2xl:px-[20vw] py-4 mb-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {children}
      </motion.section>
      
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {window.location.pathname=="/" && <Footer />}
      </motion.div>
    </motion.main>
  );
}

export default DefaultLayout;