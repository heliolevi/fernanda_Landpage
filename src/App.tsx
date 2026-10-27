import { useCallback, useState } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Preloader } from "@/components/Preloader";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ClientsMarquee } from "@/components/ClientsMarquee";
import { Work } from "@/components/Work";
import { Services } from "@/components/Services";
import { About } from "@/components/About";
import { Pricing } from "@/components/Pricing";
import { Contact } from "@/components/Contact";

export default function App() {
  const [ready, setReady] = useState(false);
  const onDone = useCallback(() => setReady(true), []);

  return (
    <div className="grain">
      <SmoothScroll />
      <Preloader onDone={onDone} />
      <Nav />
      <main>
        <Hero ready={ready} />
        <ClientsMarquee />
        <Work />
        <Services />
        <About />
        <Pricing />
        <Contact />
      </main>
    </div>
  );
}
