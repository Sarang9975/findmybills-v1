
import React from 'react';
import { FileText, Shield, Lock } from 'lucide-react';

const FooterSection: React.FC = () => {
  return (
    <footer className="bg-neutral py-16" id="footer">
      <div className="container-main">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
              <FileText size={24} className="mr-2" />
              FindMyBill
            </h2>
            <p className="text-gray-600 max-w-xs">
              Your one-stop solution for invoice and bill management.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">Product</h3>
              <ul className="space-y-2">
                <li><a href="#how-it-works" className="text-gray-600 hover:text-primary">How it Works</a></li>
                <li><a href="#use-case" className="text-gray-600 hover:text-primary">Use Cases</a></li>
                <li><a href="#charges" className="text-gray-600 hover:text-primary">Pricing</a></li>
                <li><a href="#faq" className="text-gray-600 hover:text-primary">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-primary">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Terms of Service</a></li>
                <li className="flex items-center">
                  <Shield size={14} className="text-primary mr-1" />
                  <span className="text-gray-600">DPDP 2023 Compliant</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            © 2025 FindMyBill. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <Lock size={14} className="text-primary" />
            <span>Your data stays encrypted and private</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
