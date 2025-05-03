
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItemProps {
  title: string;
  children: React.ReactNode;
}

const FaqItem: React.FC<FaqItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button 
        className="flex justify-between items-center w-full py-6 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <span className="text-gray-500">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
        <div className="text-gray-600 leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

const FaqSection: React.FC = () => {
  return (
    <section className="py-24 bg-white" id="faq">
      <div className="container-main">
        <h2 className="text-3xl font-semibold text-gray-800 mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          <FaqItem title="What is FindMyBill?">
            <p>
              FindMyBill is a unified invoice and bill storage platform that helps people download required invoices whenever needed — be it for service, exchange, warranty, or claims.
            </p>
          </FaqItem>
          
          <FaqItem title="How do I create an account?">
            <p>
              Creating an account with FindMyBill is quick and simple:
            </p>
            <ol className="list-decimal ml-5 mt-2 space-y-2">
              <li>Visit our website or download our mobile app</li>
              <li>Click on the "Try it Now" button</li>
              <li>Enter your mobile number</li>
              <li>Verify your number with the OTP (One-Time Password) sent to your phone</li>
              <li>Set up your profile with basic information</li>
              <li>Start uploading and organizing your bills and invoices!</li>
            </ol>
            <p className="mt-2">
              The entire process takes less than 2 minutes, and your account will be ready to use immediately.
            </p>
          </FaqItem>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
