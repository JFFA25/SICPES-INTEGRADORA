import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { useEffect } from "react";
import Breadcrumbs from "../components/Breadcrumbs";

const Home = () => {
  useEffect(() => {
    document.title = "SICPES";
  }, []);

  return (
    <div className="animate-page-transition">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 mt-4">
        <Breadcrumbs />
      </div>
      <Hero />
      <Footer />
    </div>
  );
};

export default Home;