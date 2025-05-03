import React from 'react';
import { User, Users, Briefcase, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation, fadeInUp, staggerContainer } from '@/hooks/useScrollAnimation';

const WhoIsItForSection: React.FC = () => {
  const { ref: sectionRef, isInView: isSectionInView } = useScrollAnimation(0.1);
  const { ref: titleRef, isInView: isTitleInView } = useScrollAnimation(0.2);

  const categories = [
    {
      icon: User,
      title: "Individuals",
      description: "Keep track of your personal purchases and warranties",
      features: ["Personal purchases", "Warranty tracking", "Easy retrieval"]
    },
    {
      icon: Users,
      title: "Families",
      description: "Manage bills for the entire family in one place",
      features: ["Family sharing", "Multi-device access", "Organized storage"]
    },
    {
      icon: Briefcase,
      title: "Solo Entrepreneurs",
      description: "Organize business expenses and receipts efficiently",
      features: ["Business expenses", "Tax preparation", "Receipt management"]
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden" id="who-is-it-for">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white" />
      
      {/* Background elements */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </motion.div>

      <div className="container-main relative">
        <motion.div 
          ref={titleRef}
          variants={fadeInUp}
          initial="hidden"
          animate={isTitleInView ? "visible" : "hidden"}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <ArrowRight className="w-4 h-4 mr-2" />
              Perfect For Everyone
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Who is it For?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're an individual, a family, or a solo entrepreneur, FindMyBill helps you manage your bills and invoices efficiently.
          </p>
        </motion.div>

        <motion.div 
          ref={sectionRef}
          variants={staggerContainer}
          initial="hidden"
          animate={isSectionInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="group"
            >
              <motion.div 
                className="relative bg-white rounded-2xl p-8 h-full border border-gray-100 transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-primary/5 rounded-xl flex items-center justify-center">
                    <category.icon size={32} className="text-primary" />
                  </div>
                </div>

                <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                  {category.title}
                </h3>

                <p className="text-gray-600 mb-6">
                  {category.description}
                </p>

                <ul className="space-y-3">
                  {category.features.map((feature, i) => (
                    <motion.li 
                      key={i}
                      className="flex items-center gap-3 text-gray-600"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhoIsItForSection;
