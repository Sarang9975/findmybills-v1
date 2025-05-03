import React from 'react';
import { Smartphone, Clock, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation, fadeInUp, fadeInLeft, fadeInRight } from '@/hooks/useScrollAnimation';

const UseCaseSection: React.FC = () => {
  const { ref: sectionRef, isInView: isSectionInView } = useScrollAnimation(0.1);
  const { ref: titleRef, isInView: isTitleInView } = useScrollAnimation(0.2);
  const { ref: cardRef, isInView: isCardInView } = useScrollAnimation(0.2);

  return (
    <section className="py-20 bg-white" id="use-case">
      <div className="container-main">
        <motion.h2 
          ref={titleRef}
          variants={fadeInUp}
          initial="hidden"
          animate={isTitleInView ? "visible" : "hidden"}
          className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center"
        >
          Use Case Example
        </motion.h2>
        
        <div className="max-w-4xl mx-auto">
          <motion.div 
            ref={sectionRef}
            variants={fadeInUp}
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            className="bg-neutral rounded-2xl p-8 md:p-10 shadow-soft"
          >
            <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
              <motion.div 
                ref={cardRef}
                variants={fadeInLeft}
                initial="hidden"
                animate={isCardInView ? "visible" : "hidden"}
                className="mb-8 md:mb-0 md:w-2/5"
              >
                <div className="relative">
                  <motion.div 
                    className="absolute inset-0 bg-accent/20 rounded-2xl transform rotate-3"
                    animate={{ 
                      rotate: [3, 5, 3],
                      scale: [1, 1.02, 1]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div 
                    className="relative bg-white rounded-2xl border border-gray-200 shadow-soft p-6"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <motion.div 
                        className="w-16 h-16 bg-highlight rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Smartphone size={32} className="text-primary" />
                      </motion.div>
                      <motion.span 
                        className="block w-full h-4 bg-neutral rounded"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      />
                      <motion.span 
                        className="block w-3/4 h-4 bg-neutral rounded"
                        initial={{ width: 0 }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      />
                      <motion.div 
                        className="w-full h-12 bg-accent/20 rounded flex items-center justify-center cursor-pointer"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(var(--accent), 0.3)" }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Download size={20} className="text-primary mr-2" />
                        <span className="text-sm font-medium">Download Invoice</span>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div 
                variants={fadeInRight}
                initial="hidden"
                animate={isCardInView ? "visible" : "hidden"}
                className="md:w-3/5"
              >
                <motion.p 
                  className="text-lg text-gray-700 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  You gifted your mom a smartphone. In 3 months, it starts lagging. You need a service claim — but can't find the invoice.
                </motion.p>
                <motion.p 
                  className="text-lg text-gray-700 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Just login with your number, search the product name or brand, and download the e-bill instantly.
                </motion.p>
                <motion.p 
                  className="text-lg font-semibold text-primary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Simple, secure, and stress-free.
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UseCaseSection;
