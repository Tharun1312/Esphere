import AboutSection from "./components/AboutSection";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import "./global.css";

export default function App() {
  return (
    <>
      <Navbar />
      <Home />
      <AboutSection />
    </>
  );
}
