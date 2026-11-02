"use client";

import { motion } from "framer-motion";

interface PageSkeletonProps {
  type?: 'hero' | 'content' | 'dashboard' | 'simple';
}

export function PageSkeleton({ type = 'content' }: PageSkeletonProps) {
  const pulseAnimation = {
    animate: {
      opacity: [0.4, 0.8, 0.4],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  if (type === 'hero') {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <motion.div
              {...pulseAnimation}
              className="h-16 bg-muted rounded-lg mb-6 max-w-4xl mx-auto"
            />
            <motion.div
              {...pulseAnimation}
              className="h-6 bg-muted rounded-lg mb-8 max-w-2xl mx-auto"
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <motion.div
                {...pulseAnimation}
                className="h-12 bg-blue-200 dark:bg-blue-800 rounded-lg w-40"
              />
              <motion.div
                {...pulseAnimation}
                className="h-12 bg-muted rounded-lg w-40"
              />
            </div>
          </div>
        </div>
        
        {/* Content Sections */}
        <div className="space-y-20">
          {[1, 2, 3].map((section) => (
            <div key={section} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                {...pulseAnimation}
                className="h-8 bg-muted rounded-lg mb-4 max-w-md mx-auto"
              />
              <motion.div
                {...pulseAnimation}
                className="h-4 bg-muted rounded-lg mb-8 max-w-lg mx-auto"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((card) => (
                  <motion.div
                    key={card}
                    {...pulseAnimation}
                    className="glass p-6 rounded-2xl space-y-4"
                  >
                    <div className="h-6 bg-muted rounded-lg" />
                    <div className="h-4 bg-muted rounded-lg" />
                    <div className="h-4 bg-muted rounded-lg w-3/4" />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'dashboard') {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="mb-8">
            <motion.div
              {...pulseAnimation}
              className="h-8 bg-muted rounded-lg mb-2 max-w-xs"
            />
            <motion.div
              {...pulseAnimation}
              className="h-4 bg-muted rounded-lg max-w-md"
            />
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((stat) => (
              <motion.div
                key={stat}
                {...pulseAnimation}
                className="glass p-6 rounded-2xl space-y-3"
              >
                <div className="h-4 bg-muted rounded-lg w-1/2" />
                <div className="h-8 bg-muted rounded-lg" />
                <div className="h-3 bg-muted rounded-lg w-1/3" />
              </motion.div>
            ))}
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <motion.div
                {...pulseAnimation}
                className="glass p-6 rounded-2xl h-96"
              />
            </div>
            <div className="space-y-6">
              <motion.div
                {...pulseAnimation}
                className="glass p-6 rounded-2xl h-48"
              />
              <motion.div
                {...pulseAnimation}
                className="glass p-6 rounded-2xl h-40"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'simple') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <motion.div
            className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            {...pulseAnimation}
            className="h-4 bg-muted rounded-lg w-32 mx-auto"
          />
        </div>
      </div>
    );
  }

  // Default content skeleton
  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            {...pulseAnimation}
            className="h-12 bg-muted rounded-lg mb-4 max-w-2xl mx-auto"
          />
          <motion.div
            {...pulseAnimation}
            className="h-6 bg-muted rounded-lg mb-8 max-w-xl mx-auto"
          />
          <motion.div
            {...pulseAnimation}
            className="h-12 bg-blue-200 dark:bg-blue-800 rounded-lg max-w-xs mx-auto"
          />
        </div>
      </div>
      
      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {/* Text Content */}
          <div className="space-y-4">
            <motion.div
              {...pulseAnimation}
              className="h-6 bg-muted rounded-lg max-w-md"
            />
            <motion.div
              {...pulseAnimation}
              className="h-4 bg-muted rounded-lg max-w-full"
            />
            <motion.div
              {...pulseAnimation}
              className="h-4 bg-muted rounded-lg max-w-5xl"
            />
            <motion.div
              {...pulseAnimation}
              className="h-4 bg-muted rounded-lg max-w-3xl"
            />
          </div>
          
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((card) => (
              <motion.div
                key={card}
                {...pulseAnimation}
                className="glass p-6 rounded-2xl space-y-4"
              >
                <div className="h-6 bg-muted rounded-lg" />
                <div className="h-4 bg-muted rounded-lg" />
                <div className="h-4 bg-muted rounded-lg w-2/3" />
                <div className="h-8 bg-blue-200 dark:bg-blue-800 rounded-lg w-1/2" />
              </motion.div>
            ))}
          </div>
          
          {/* Additional Content */}
          <div className="space-y-6">
            <motion.div
              {...pulseAnimation}
              className="h-6 bg-muted rounded-lg max-w-lg"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <motion.div
                  {...pulseAnimation}
                  className="h-4 bg-muted rounded-lg"
                />
                <motion.div
                  {...pulseAnimation}
                  className="h-4 bg-muted rounded-lg w-5/6"
                />
                <motion.div
                  {...pulseAnimation}
                  className="h-4 bg-muted rounded-lg w-4/5"
                />
              </div>
              <div className="space-y-4">
                <motion.div
                  {...pulseAnimation}
                  className="h-4 bg-muted rounded-lg"
                />
                <motion.div
                  {...pulseAnimation}
                  className="h-4 bg-muted rounded-lg w-3/4"
                />
                <motion.div
                  {...pulseAnimation}
                  className="h-4 bg-muted rounded-lg w-5/6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}