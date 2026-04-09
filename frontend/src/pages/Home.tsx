import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    document.title = "SICPES";
  }, []);

  return (
    <div className="animate-page-transition">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
};

export default Home;