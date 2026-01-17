import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { motion } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
  hideNavbar?: boolean;
}

export function Layout({ children, hideFooter, hideNavbar }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`flex-1 ${hideNavbar ? '' : 'pt-16 md:pt-20'}`}
      >
        {children}
      </motion.main>
      {!hideFooter && <Footer />}
    </div>
  );
}
