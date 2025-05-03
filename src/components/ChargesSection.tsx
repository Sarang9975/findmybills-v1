import React from 'react';

const ChargesSection: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900" id="pricing">
      <div className="container-main">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-12 text-center">
          Charges
        </h2>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm text-center">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              We only charge a nominal maintenance fee to keep the platform running. That's it — no hidden costs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChargesSection;
