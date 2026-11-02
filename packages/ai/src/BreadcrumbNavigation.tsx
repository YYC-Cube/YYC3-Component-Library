"use client";

import { ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";

interface Breadcrumb {
  label: string;
  href: string;
}

interface BreadcrumbNavigationProps {
  breadcrumbs: Breadcrumb[];
  navigate: (page: string) => void;
}

export function BreadcrumbNavigation({ breadcrumbs, navigate }: BreadcrumbNavigationProps) {
  if (!breadcrumbs || breadcrumbs.length <= 1) {
    return null;
  }

  const handleClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    const page = href === '/' ? 'home' : href.slice(1);
    navigate(page);
  };

  return (
    <div className="bg-background-secondary/30 dark:bg-background-secondary/50 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="py-3">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <motion.li 
                key={crumb.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center"
              >
                {index === 0 && (
                  <Home className="w-4 h-4 mr-1 text-foreground-muted" />
                )}
                
                {index < breadcrumbs.length - 1 ? (
                  <button
                    onClick={(e) => handleClick(crumb.href, e)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors hover:underline"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-foreground-muted font-medium">
                    {crumb.label}
                  </span>
                )}
                
                {index < breadcrumbs.length - 1 && (
                  <ChevronRight className="w-4 h-4 mx-2 text-foreground-muted" />
                )}
              </motion.li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}