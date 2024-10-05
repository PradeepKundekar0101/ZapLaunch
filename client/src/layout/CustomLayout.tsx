import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/ui/navbar";

type Props = {
  children: React.ReactNode;
};

function DefaultLayout({ children }: Props) {
  return (
    <main className="flex flex-col dark:bg-darkBackground overflow-x-hidden">
      <Navbar />
      <Toaster />
      <section className="px-8 max-md:px-8 lg:px-[20vw] py-4 mb-4">
        {children}
      </section>
    </main>
  );
}

export default DefaultLayout;