import React from 'react';
import { UserPlus, UploadSimple, DownloadSimple } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useScrollAnimation, fadeInUp, staggerContainer } from '@/hooks/useScrollAnimation';

const steps = [
  {
    title: 'Open Your Account',
    description: 'Create your secure FindMyBill account in seconds to start managing your documents.',
    icon: UserPlus,
    features: [],
  },
  {
    title: 'Upload or Search for Invoices',
    description: '',
    icon: UploadSimple,
    features: [
      'Upload manually (photo or file)',
      'OR retrieve automatically via mobile number + OTP',
    ],
  },
  {
    title: 'Track & Download Anytime',
    description: 'Access your bills and invoices whenever you need them, from any device, anywhere.',
    icon: DownloadSimple,
    features: [],
  },
];

const HowItWorksSection: React.FC = () => {
  const { ref: sectionRef, isInView: isSectionInView } = useScrollAnimation(0.1);
  const { ref: titleRef, isInView: isTitleInView } = useScrollAnimation(0.2);

  return (
    <section className="relative py-24 overflow-hidden" id="how-it-works">
      <div className="container-main relative z-10">
        <motion.div
          ref={titleRef}
          variants={fadeInUp}
          initial="hidden"
          animate={isTitleInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Simple Steps
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            How it Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started in minutes and never worry about losing your bills again
          </p>
        </motion.div>

        <motion.div
          ref={sectionRef}
          variants={staggerContainer}
          initial="hidden"
          animate={isSectionInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative group"
              >
                {/* Card Background with Gradient */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl transform -rotate-1"
                  animate={{ 
                    rotate: [-1, 1, -1],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Main Card Content */}
                <motion.div 
                  className="relative bg-white rounded-3xl p-8 shadow-lg h-full transform transition-all duration-300 group-hover:-translate-y-2"
                  whileHover={{ 
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  {/* Step Number */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-medium text-sm shadow-lg">
                    {index + 1}
                </div>

                  {/* Icon Container - Centered */}
                  <motion.div 
                    className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 transform transition-transform duration-300 group-hover:scale-110 mx-auto"
                  >
                    <Icon size={32} className="text-primary" weight="fill" />
                  </motion.div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                    {step.title}
                  </h3>
                    
                  {step.description && (
                      <motion.p 
                        className="text-gray-600 mb-4 text-left"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                          <span>{step.description}</span>
                        </div>
                      </motion.p>
                  )}
                  </div>
                  
                  {step.features.length > 0 && (
                    <ul className="space-y-3 text-left">
                      {step.features.map((feature, i) => (
                        <motion.li 
                          key={i}
                          className="flex items-start gap-3 text-gray-600"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i }}
                        >
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
