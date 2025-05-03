import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight, Sparkles, Search, Download, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation, fadeInUp, fadeInLeft, fadeInRight, scaleIn } from '@/hooks/useScrollAnimation';

const AnimatedCard = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      icon: Search,
      title: "Searching invoice...",
      subtitle: "AI-powered search in progress",
      color: "text-primary",
      bgColor: "bg-primary/5"
    },
    {
      icon: FileText,
      title: "Invoice found!",
      subtitle: "Smartphone purchase - Jan 2023",
      color: "text-primary",
      bgColor: "bg-primary/5"
    },
    {
      icon: Download,
      title: "Ready to download",
      subtitle: "All warranty details included",
      color: "text-primary",
      bgColor: "bg-primary/5"
    }
  ];

  return (
    <motion.div 
      className="relative w-full max-w-md perspective-1000"
      animate={{ rotateY: [0, 5, 0], rotateX: [0, -5, 0] }}
      transition={{ 
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* 3D Card Container */}
      <div className="relative transform-style-3d">
        {/* Floating Elements */}
        <motion.div
          className="absolute -top-6 -right-6 w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 z-10"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 z-10"
          animate={{ 
            y: [0, 10, 0],
            rotate: [0, -10, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        {/* Main Card */}
        <div className="relative bg-white dark:bg-gray-800 rounded-3xl border border-primary/10 dark:border-primary/20 shadow-2xl p-8 transform-style-3d">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 dark:to-transparent rounded-3xl" />

          <div className="relative flex flex-col space-y-4">
            {/* Top Section with Animated Icon */}
            <motion.div 
              className="w-full h-32 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-xl flex items-center justify-center"
              animate={{ 
                boxShadow: ['0 0 20px rgba(var(--primary), 0.1)', '0 0 20px rgba(var(--primary), 0.2)']
              }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {React.createElement(steps[currentStep].icon, {
                    size: 64,
                    className: "text-primary/40 dark:text-primary/50"
                  })}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Status Cards */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col space-y-4"
              >
                <div className="flex items-center px-4 py-3 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10 dark:border-primary/20">
                  <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    {React.createElement(steps[currentStep].icon, {
                      size: 18,
                      className: "text-primary"
                    })}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{steps[currentStep].title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{steps[currentStep].subtitle}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress Dots */}
            <div className="flex justify-center space-x-2">
              {[0, 1, 2].map((step) => (
                <motion.div
                  key={step}
                  className={`w-2 h-2 rounded-full ${currentStep === step ? 'bg-primary' : 'bg-primary/20 dark:bg-primary/30'}`}
                  animate={currentStep === step ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { ref: titleRef, isInView: isTitleInView } = useScrollAnimation(0.2);
  const { ref: contentRef, isInView: isContentInView } = useScrollAnimation(0.2);
  const { ref: cardRef, isInView: isCardInView } = useScrollAnimation(0.2);

  const scrollToHowItWorks = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-28 md:py-40">
      {/* Background decorative elements */}
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="absolute -top-60 -right-60 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-60 -left-60 w-[500px] h-[500px] bg-accent/5 dark:bg-accent/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </motion.div>

      <div className="container-main relative">
        <div className="flex flex-col lg:flex-row items-center gap-12 pt-0 -mt-7">
          <motion.div 
            ref={titleRef}
            variants={fadeInLeft}
            initial="hidden"
            animate={isTitleInView ? "visible" : "hidden"}
            className="lg:w-1/2 lg:pr-10"
          >
            <motion.div 
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 text-primary mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Sparkles size={16} className="mr-2" />
              <span className="text-sm font-medium">Instant Access. Zero Hassle.</span>
            </motion.div>
            
            <motion.div 
              className="mb-6"
              variants={fadeInUp}
              initial="hidden"
              animate={isTitleInView ? "visible" : "hidden"}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                Never Lose<br />
                Your <span className="text-primary">Bills</span> Again
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 leading-relaxed"
              variants={fadeInUp}
              initial="hidden"
              animate={isTitleInView ? "visible" : "hidden"}
              transition={{ delay: 0.4 }}
            >
              Your one-stop solution to store, search & retrieve all your invoices, bills, and travel tickets — anytime, anywhere.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={fadeInUp}
              initial="hidden"
              animate={isTitleInView ? "visible" : "hidden"}
              transition={{ delay: 0.5 }}
            >
              <Button 
                className="bg-primary hover:bg-primary/90 text-white font-semibold text-lg py-6 px-8 rounded-full shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 flex items-center space-x-2 group"
                onClick={() => navigate('/login')}
              >
                <FileText size={20} />
                <span>Try it Now</span>
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline"
                className="bg-white dark:bg-gray-800 font-semibold text-lg py-6 px-8 rounded-full border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300 flex items-center space-x-2 group relative overflow-hidden"
                onClick={scrollToHowItWorks}
              >
                <span className="relative z-10">Learn More</span>
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform relative z-10" />
                <motion.div 
                  className="absolute inset-0 bg-primary/5 dark:bg-blue-500/10"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            ref={cardRef}
            variants={fadeInRight}
            initial="hidden"
            animate={isCardInView ? "visible" : "hidden"}
            className="lg:w-1/2 flex justify-center"
          >
            <AnimatedCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
