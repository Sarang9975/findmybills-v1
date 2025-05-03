import React from 'react';
import SharedNav from '@/components/SharedNav';
import HeroSection from '@/components/HeroSection';
import FaqSection from '@/components/FaqSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import WhoIsItForSection from '@/components/WhoIsItForSection';
import UseCaseSection from '@/components/UseCaseSection';
import DataPrivacySection from '@/components/DataPrivacySection';
import ChargesSection from '@/components/ChargesSection';
import CtaSection from '@/components/CtaSection';
import FooterSection from '@/components/FooterSection';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen">
      <SharedNav />
      
      <main className="pt-12">
        <HeroSection />
        <HowItWorksSection />
        <WhoIsItForSection />
        <UseCaseSection />
        <DataPrivacySection />
        <ChargesSection />
        <FaqSection />
        <CtaSection />
      </main>
      
      <FooterSection />
    </div>
  );
};

export default Index;
