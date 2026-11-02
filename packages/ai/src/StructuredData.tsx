"use client";

import { useEffect } from 'react';
import { useLanguage } from './LanguageProvider';

interface LocalBusinessSchema {
  "@type": "LocalBusiness";
  name: string;
  description: string;
  url: string;
  telephone: string;
  email?: string;
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    "@type": "GeoCoordinates";
    latitude: string;
    longitude: string;
  };
  openingHours: string[];
  priceRange?: string;
  paymentAccepted?: string[];
  currenciesAccepted?: string;
  areaServed?: string[];
  serviceArea?: {
    "@type": "GeoCircle";
    geoMidpoint: {
      "@type": "GeoCoordinates";
      latitude: string;
      longitude: string;
    };
    geoRadius: string;
  };
  logo?: string;
  image?: string[];
  sameAs?: string[];
  foundingDate?: string;
  numberOfEmployees?: string;
  slogan?: string;
}

interface ServiceSchema {
  "@type": "Service";
  name: string;
  description: string;
  provider: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  serviceType: string;
  category?: string;
  audience?: {
    "@type": "BusinessAudience";
    audienceType: string;
  };
  areaServed?: string[];
  hasOfferCatalog?: {
    "@type": "OfferCatalog";
    name: string;
    itemListElement: Array<{
      "@type": "Offer";
      itemOffered: {
        "@type": "Service";
        name: string;
        description: string;
      };
    }>;
  };
  offers?: {
    "@type": "Offer";
    price?: string;
    priceCurrency?: string;
    priceRange?: string;
    availability?: string;
    validFrom?: string;
    validThrough?: string;
  };
}

interface FAQSchema {
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

interface BreadcrumbSchema {
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}

interface WebPageSchema {
  "@type": "WebPage";
  name: string;
  description: string;
  url: string;
  inLanguage: string;
  isPartOf: {
    "@type": "WebSite";
    name: string;
    url: string;
  };
  about?: {
    "@type": "Thing";
    name: string;
  };
  breadcrumb?: BreadcrumbSchema;
  mainEntity?: any;
  author?: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  publisher?: {
    "@type": "Organization";
    name: string;
    logo: {
      "@type": "ImageObject";
      url: string;
    };
  };
  datePublished?: string;
  dateModified?: string;
  keywords?: string[];
}

interface ArticleSchema {
  "@type": "Article";
  headline: string;
  description: string;
  image?: string[];
  author: {
    "@type": "Organization" | "Person";
    name: string;
    url?: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo: {
      "@type": "ImageObject";
      url: string;
    };
  };
  datePublished: string;
  dateModified: string;
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id": string;
  };
  articleSection?: string;
  wordCount?: number;
  timeRequired?: string;
  keywords?: string[];
  about?: Array<{
    "@type": "Thing";
    name: string;
  }>;
}

interface OrganizationSchema {
  "@type": "Organization";
  name: string;
  description: string;
  url: string;
  logo: string;
  image?: string[];
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint: {
    "@type": "ContactPoint";
    telephone: string;
    contactType: string;
    availableLanguage: string[];
    email?: string;
  };
  sameAs: string[];
  foundingDate: string;
  foundingLocation: string;
  numberOfEmployees: string;
  industry: string;
  slogan: string;
  knowsAbout?: string[];
  memberOf?: Array<{
    "@type": "Organization";
    name: string;
  }>;
  award?: string[];
  parentOrganization?: {
    "@type": "Organization";
    name: string;
  };
  subOrganization?: Array<{
    "@type": "Organization";
    name: string;
  }>;
}

type StructuredDataSchema = 
  | LocalBusinessSchema 
  | ServiceSchema 
  | FAQSchema 
  | BreadcrumbSchema 
  | WebPageSchema 
  | ArticleSchema 
  | OrganizationSchema;

interface StructuredDataProps {
  schema: StructuredDataSchema | StructuredDataSchema[];
  id?: string;
}

export function StructuredData({ schema, id = "structured-data" }: StructuredDataProps) {
  const { language } = useLanguage();

  useEffect(() => {
    // Create the structured data script
    const structuredDataScript = document.createElement('script');
    structuredDataScript.type = 'application/ld+json';
    structuredDataScript.id = id;
    
    // Handle both single schema and array of schemas
    const schemaData = Array.isArray(schema) ? schema : [schema];
    
    // Add @context to each schema if not present
    const enhancedSchema = schemaData.map(item => ({
      "@context": "https://schema.org",
      ...item,
    }));

    // If there's only one schema, don't wrap in array
    const finalSchema = enhancedSchema.length === 1 ? enhancedSchema[0] : enhancedSchema;
    
    structuredDataScript.textContent = JSON.stringify(finalSchema, null, 2);

    // Remove existing structured data script with same ID
    const existingScript = document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data script
    document.head.appendChild(structuredDataScript);

    // Cleanup function
    return () => {
      const scriptToRemove = document.getElementById(id);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [schema, id, language]);

  return null;
}

// Predefined structured data for common use cases
export const DelibixOrganizationSchema: OrganizationSchema = {
  "@type": "Organization",
  name: "Delibix",
  description: "AI-Native Digital Consulting company helping businesses transform through artificial intelligence and digital innovation.",
  url: "https://delibix.com",
  logo: "https://delibix.com/logo.png",
  image: [
    "https://delibix.com/images/delibix-office.jpg",
    "https://delibix.com/images/delibix-team.jpg",
    "https://delibix.com/images/delibix-workspace.jpg"
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Malioboro Street No. 123",
    addressLocality: "Yogyakarta",
    addressRegion: "Special Region of Yogyakarta",
    postalCode: "55271",
    addressCountry: "ID"
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+62-274-123456",
    contactType: "customer service",
    availableLanguage: ["Indonesian", "English", "Chinese", "Hindi", "Spanish", "French", "Arabic"],
    email: "hello@delibix.com"
  },
  sameAs: [
    "https://linkedin.com/company/delibix",
    "https://twitter.com/delibix",
    "https://instagram.com/delibix",
    "https://facebook.com/delibix",
    "https://youtube.com/@delibix",
    "https://github.com/delibix"
  ],
  foundingDate: "2024",
  foundingLocation: "Yogyakarta, Indonesia",
  numberOfEmployees: "10-50",
  industry: "Technology Consulting",
  slogan: "AI-Native Digital Consulting",
  knowsAbout: [
    "Artificial Intelligence",
    "Machine Learning",
    "Digital Transformation",
    "Business Automation",
    "Data Analytics",
    "Cloud Computing",
    "Software Development",
    "Digital Strategy",
    "Process Optimization",
    "Business Intelligence"
  ],
  memberOf: [
    {
      "@type": "Organization",
      name: "Indonesia AI Association"
    },
    {
      "@type": "Organization", 
      name: "Southeast Asia Digital Chamber"
    }
  ],
  award: [
    "Best AI Consulting Startup 2024",
    "Digital Innovation Award 2024",
    "Yogyakarta Tech Excellence Award"
  ]
};

export const DelibixLocalBusinessSchema: LocalBusinessSchema = {
  "@type": "LocalBusiness",
  name: "Delibix",
  description: "AI-Native Digital Consulting services in Yogyakarta, Indonesia. Helping businesses accelerate digital transformation through artificial intelligence.",
  url: "https://delibix.com",
  telephone: "+62-274-123456",
  email: "hello@delibix.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Malioboro Street No. 123",
    addressLocality: "Yogyakarta",
    addressRegion: "Special Region of Yogyakarta",
    postalCode: "55271",
    addressCountry: "ID"
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "-7.7956",
    longitude: "110.3695"
  },
  openingHours: [
    "Mo-Fr 09:00-18:00",
    "Sa 09:00-14:00"
  ],
  priceRange: "$$",
  paymentAccepted: ["Cash", "Credit Card", "Bank Transfer", "Digital Payment"],
  currenciesAccepted: "IDR",
  areaServed: [
    "Indonesia",
    "Southeast Asia",
    "Asia Pacific"
  ],
  serviceArea: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: "-7.7956",
      longitude: "110.3695"
    },
    geoRadius: "2000km"
  },
  logo: "https://delibix.com/logo.png",
  image: [
    "https://delibix.com/images/delibix-office-exterior.jpg",
    "https://delibix.com/images/delibix-office-interior.jpg",
    "https://delibix.com/images/delibix-meeting-room.jpg"
  ],
  sameAs: [
    "https://linkedin.com/company/delibix",
    "https://twitter.com/delibix",
    "https://instagram.com/delibix",
    "https://facebook.com/delibix"
  ],
  foundingDate: "2024",
  numberOfEmployees: "10-50",
  slogan: "AI-Native Digital Consulting"
};

// Helper function to create service-specific structured data
export function createServiceSchema(
  serviceName: string,
  serviceDescription: string,
  serviceType: string,
  category?: string,
  offers?: ServiceSchema['offers']
): ServiceSchema {
  return {
    "@type": "Service",
    name: serviceName,
    description: serviceDescription,
    provider: {
      "@type": "Organization",
      name: "Delibix",
      url: "https://delibix.com"
    },
    serviceType,
    category,
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Business"
    },
    areaServed: [
      "Indonesia",
      "Southeast Asia",
      "Asia Pacific"
    ],
    offers
  };
}

// Helper function to create FAQ structured data
export function createFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): FAQSchema {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

// Helper function to create breadcrumb structured data
export function createBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url?: string }>
): BreadcrumbSchema {
  return {
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      ...(breadcrumb.url && { item: breadcrumb.url })
    }))
  };
}

// Helper function to create article structured data
export function createArticleSchema(
  title: string,
  description: string,
  url: string,
  publishedDate: string,
  modifiedDate: string,
  author: string = "Delibix",
  image?: string[],
  section?: string,
  wordCount?: number,
  readingTime?: string
): ArticleSchema {
  return {
    "@type": "Article",
    headline: title,
    description,
    image,
    author: {
      "@type": "Organization",
      name: author,
      url: "https://delibix.com"
    },
    publisher: {
      "@type": "Organization",
      name: "Delibix",
      logo: {
        "@type": "ImageObject",
        url: "https://delibix.com/logo.png"
      }
    },
    datePublished: publishedDate,
    dateModified: modifiedDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    },
    articleSection: section,
    wordCount,
    timeRequired: readingTime
  };
}