"use client";

import { useEffect } from "react";

interface Breadcrumb {
  label: string;
  href: string;
}

interface SEOHeadProps {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage?: string;
  schemaType?: 'WebPage' | 'Organization' | 'Service' | 'LocalBusiness' | 'FAQ';
  serviceName?: string;
  serviceType?: string;
  modifiedDate?: string;
  breadcrumbs?: Breadcrumb[];
  noIndex?: boolean;
  structuredData?: any;
}

export function SEOHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = '/images/og/delibix-default.jpg',
  schemaType = 'WebPage',
  serviceName,
  serviceType,
  modifiedDate,
  breadcrumbs = [],
  noIndex = false,
  structuredData
}: SEOHeadProps) {
  
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords.join(', '));
    
    // Robots meta
    if (noIndex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow');
    }
    
    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:url', `https://delibix.com${canonicalUrl}`, true);
    updateMetaTag('og:image', `https://delibix.com${ogImage}`, true);
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);
    updateMetaTag('og:site_name', 'Delibix', true);
    updateMetaTag('og:locale', 'en_US', true);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', `https://delibix.com${ogImage}`);
    updateMetaTag('twitter:site', '@delibix');
    updateMetaTag('twitter:creator', '@delibix');
    
    // Additional SEO tags
    updateMetaTag('author', 'Delibix');
    updateMetaTag('publisher', 'Delibix');
    if (modifiedDate) {
      updateMetaTag('last-modified', modifiedDate);
    }
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://delibix.com${canonicalUrl}`);
    
    // Generate and inject structured data
    const generateStructuredData = () => {
      // If custom structured data is provided, use it
      if (structuredData) {
        return structuredData;
      }

      // Base structured data
      const baseData = {
        "@context": "https://schema.org",
        "@type": schemaType,
        "name": title,
        "description": description,
        "url": `https://delibix.com${canonicalUrl}`,
        "image": `https://delibix.com${ogImage}`,
      };

      // Add breadcrumbs if available
      if (breadcrumbs && breadcrumbs.length > 1) {
        baseData["breadcrumb"] = {
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.label,
            "item": `https://delibix.com${crumb.href}`
          }))
        };
      }

      // Add organization data
      if (schemaType === 'Organization' || schemaType === 'LocalBusiness') {
        return {
          ...baseData,
          "@type": "Organization",
          "legalName": "Delibix",
          "alternateName": "Delibix AI Consulting",
          "url": "https://delibix.com",
          "logo": "https://delibix.com/logo.png",
          "foundingDate": "2024",
          "founders": [
            {
              "@type": "Person",
              "name": "Delibix Founder"
            }
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+62-857-7002-4933",
            "contactType": "customer service",
            "areaServed": ["ID", "SG", "MY", "TH", "VN", "PH"],
            "availableLanguage": ["en", "id", "zh", "hi", "es", "fr", "ar"]
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Yogyakarta",
            "addressLocality": "Yogyakarta",
            "addressRegion": "DIY",
            "addressCountry": "ID"
          },
          "sameAs": [
            "https://linkedin.com/company/delibix",
            "https://twitter.com/delibix",
            "https://facebook.com/delibix"
          ],
          "serviceArea": {
            "@type": "GeoCircle",
            "geoMidpoint": {
              "@type": "GeoCoordinates",
              "latitude": "-7.797068",
              "longitude": "110.370529"
            },
            "geoRadius": "500000"
          }
        };
      }

      // Add service data
      if (schemaType === 'Service' && serviceName) {
        return {
          ...baseData,
          "@type": "Service",
          "serviceType": serviceType || "Consulting Service",
          "provider": {
            "@type": "Organization",
            "name": "Delibix",
            "url": "https://delibix.com"
          },
          "areaServed": {
            "@type": "Country",
            "name": "Indonesia"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "AI Consulting Services",
            "itemListElement": [
              {
                "@type": "OfferCatalog",
                "name": "Digital Strategy Consulting"
              },
              {
                "@type": "OfferCatalog", 
                "name": "AI Implementation Services"
              },
              {
                "@type": "OfferCatalog",
                "name": "Business Process Automation"
              }
            ]
          }
        };
      }

      // Add FAQ data
      if (schemaType === 'FAQ') {
        return {
          ...baseData,
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What AI consulting services does Delibix offer?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Delibix offers comprehensive AI consulting services including digital strategy, AI implementation, business automation, machine learning solutions, and enterprise AI transformation."
              }
            },
            {
              "@type": "Question", 
              "name": "How long does a typical AI transformation project take?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "AI transformation projects typically take 3-12 months depending on scope and complexity. We provide detailed timelines during our initial consultation."
              }
            }
          ]
        };
      }

      return baseData;
    };

    // Inject structured data
    const structuredDataScript = document.getElementById('structured-data');
    if (structuredDataScript) {
      structuredDataScript.remove();
    }
    
    const script = document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(generateStructuredData());
    document.head.appendChild(script);

    // Add additional meta tags for better SEO
    updateMetaTag('theme-color', '#2563eb');
    updateMetaTag('msapplication-TileColor', '#2563eb');
    updateMetaTag('application-name', 'Delibix');
    updateMetaTag('apple-mobile-web-app-title', 'Delibix');
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    
    // Language and region targeting
    updateMetaTag('geo.region', 'ID-YO');
    updateMetaTag('geo.placename', 'Yogyakarta');
    updateMetaTag('geo.position', '-7.797068;110.370529');
    updateMetaTag('ICBM', '-7.797068, 110.370529');
    
    // Business classification
    updateMetaTag('classification', 'Business Consulting, AI Consulting, Digital Transformation');
    updateMetaTag('category', 'AI Consulting Services');
    updateMetaTag('coverage', 'Worldwide');
    updateMetaTag('distribution', 'Global');
    updateMetaTag('rating', 'General');
    
  }, [title, description, keywords, canonicalUrl, ogImage, schemaType, serviceName, serviceType, modifiedDate, breadcrumbs, noIndex, structuredData]);

  // This component doesn't render anything visible
  return null;
}