import { Community } from './Community';
import { CTA } from './CTA';
import { FAQ } from './FAQ';
import { Features } from './Features';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { HowItWorks } from './HowItWorks';
import { MoodRecommendation } from './MoodRecommendation';
import { ReadingChallenge } from './ReadingChallenge';
import { SeatAvailability } from './SeatAvailability';
import { Statistics } from './Statistics';
import { Testimonials } from './Testimonials';

export function LandingPage() {
  return (
    <>
      <Hero />
      <Statistics />
      <Features />
      <HowItWorks />
      <MoodRecommendation />
      <SeatAvailability />
      <ReadingChallenge />
      <Community />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}
