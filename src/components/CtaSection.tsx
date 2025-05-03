
import React from 'react';
import { Button } from '@/components/ui/button';

const CtaSection: React.FC = () => {
  return (
    <section className="py-20 bg-primary" id="cta">
      <div className="container-main">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
            Try it Now
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Ready to sort all your invoices in one place?
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button className="bg-white hover:bg-neutral text-primary font-semibold text-lg py-6 px-8 rounded-full">
              Start sorting smart
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-primary font-semibold text-lg py-6 px-8 rounded-full">
              Your bills. Your terms.
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
