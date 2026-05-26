import { ArtistHighlights } from "@/components/home/ArtistHighlights";
import { FeaturedProgramme } from "@/components/home/FeaturedProgramme";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { VenueHighlights } from "@/components/home/VenueHighlights";

export default function Home() {
  return (
    <div className="min-h-full bg-festival-bg text-festival-cream">
      <Hero />
      <Intro />
      <FeaturedProgramme />
      <ArtistHighlights />
      <VenueHighlights />
      <Footer />
    </div>
  );
}
