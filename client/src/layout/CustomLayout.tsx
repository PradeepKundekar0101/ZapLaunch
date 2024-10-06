import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

type Props = {
  children: React.ReactNode;
};

function DefaultLayout({ children }: Props) {
  return (
    <main className="flex flex-col  overflow-x-hidden">
      <Navbar />
      <Toaster />
      <section className="px-8 max-md:px-8 lg:px[5vw] xl:px-[10vw] 2xl:px-[20vw] py-4 mb-4">
        {children}
      </section>
      <Footer/>
    </main>
  );
}

export default DefaultLayout;