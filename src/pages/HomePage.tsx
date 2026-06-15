import HeroSection from '@/components/home/HeroSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import PopularBouquets from '@/components/home/PopularBouquets';
import ReviewsSection from '@/components/home/ReviewsSection';
import FAQSection from '@/components/home/FAQSection';
import InstagramGallery from '@/components/home/InstagramGallery';
import ContactsSection from '@/components/home/ContactsSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <PopularBouquets />
      <ReviewsSection />
      <FAQSection />
      <InstagramGallery />
      <ContactsSection />
    </>
  );
}
