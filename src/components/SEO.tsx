import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  pathname?: string;
}

export function SEO({ 
  title = 'AISurfer Blog - Exploring AI, ML & Web Development',
  description = 'Discover insights and tutorials about Artificial Intelligence, Machine Learning, and modern web development.',
  image = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=630&fit=crop',
  type = 'website',
  pathname = ''
}: SEOProps) {
  const siteUrl = window.location.origin;
  const url = `${siteUrl}${pathname}`;

  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="keywords" content="AI, Machine Learning, Web Development, Programming, Technology, Blog" />
      <meta name="author" content="Minhazul Islam" />
    </Helmet>
  );
}