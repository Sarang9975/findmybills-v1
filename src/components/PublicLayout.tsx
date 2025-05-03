import React from 'react';
import SharedNav from './SharedNav';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <SharedNav />
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
};

export default PublicLayout; 