import React from 'react';
import { Shield, Lock, Clock } from 'lucide-react';

const DataPrivacySection: React.FC = () => {
  return (
    <section className="py-20 bg-neutral" id="privacy">
      <div className="container-main">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-soft p-8 md:p-12">
          <div className="flex items-center justify-center mb-8">
            <Shield size={38} className="text-primary mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Data Privacy First</h2>
          </div>
          
          <p className="text-center text-lg text-gray-700 mb-10">
            We respect your privacy.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-neutral rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-highlight rounded-full flex items-center justify-center mb-4">
                <Shield size={24} className="text-primary" />
              </div>
              <p className="text-gray-700">Adheres to DPDP 2023 principles</p>
            </div>
            
            <div className="bg-neutral rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-highlight rounded-full flex items-center justify-center mb-4">
                <Lock size={24} className="text-primary" />
              </div>
              <p className="text-gray-700">No misuse, no spam — ever</p>
            </div>
            
            <div className="bg-neutral rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-highlight rounded-full flex items-center justify-center mb-4">
                <Lock size={24} className="text-primary" />
              </div>
              <p className="text-gray-700">Your data stays secure, encrypted, and accessible only to you</p>
            </div>
          </div>
          
          <div className="mt-12 flex justify-center">
            <div className="flex items-center px-6 py-3 bg-primary/5 rounded-full">
              <Shield size={20} className="text-primary mr-2" />
              <p className="text-sm font-medium text-primary">DPDP 2023 Compliant</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataPrivacySection;
