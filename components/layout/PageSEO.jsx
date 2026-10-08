import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_NAME, SITE_URL } from '../../config';
import { PLACEHOLDER_IDS, placeholderImage } from '../../utils/placeholderImage';

const DEFAULT_IMAGE = placeholderImage(PLACEHOLDER_IDS.hero, 1200, 630);

export default function PageSEO({
  title,
  description = 'Pakistan AI is an interactive encyclopedia, tourism guide, and AI assistant exploring the history, culture, geography, and statistics of Pakistan.',
  canonical,
  image,
  type = 'website',
  schema,
  breadcrumbs,
  article,
  place,
  naturalFeature,
  faqItems,
  keywords,
}) {
  const fullTitle = title ? `${title} | ${APP_NAME}` : `${APP_NAME} — Discover Pakistan. Ask Anything.`;
  const canonicalUrl = canonical
    ? canonical.startsWith('http')
      ? canonical
      : `${SITE_URL}${canonical.startsWith('/') ? canonical : `/${canonical}`}`
    : SITE_URL;

  const resolvedImage = image
    ? image.startsWith('http')
      ? image
      : `${SITE_URL}${image.startsWith('/') ? image : `/${image}`}`
    : DEFAULT_IMAGE;

  // Build JSON-LD structured schemas
  const jsonLdSchemas = useMemo(() => {
    const list = [];

    // 1. Breadcrumbs
    if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
      list.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: b.name,
          item: b.url?.startsWith('http') ? b.url : `${SITE_URL}${b.url?.startsWith('/') ? b.url : `/${b.url || ''}`}`,
        })),
      });
    }

    // 2. Article
    if (article) {
      list.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title || title,
        description: article.description || description,
        image: resolvedImage,
        datePublished: article.datePublished || new Date().toISOString(),
        dateModified: article.dateModified || article.datePublished || new Date().toISOString(),
        author: {
          '@type': 'Organization',
          name: article.author || 'Pakistan AI Team',
          url: SITE_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: APP_NAME,
          url: SITE_URL,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/favicon/favicon.svg`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
      });
    }

    // 3. TouristDestination / Place
    if (place) {
      const placeSchema = {
        '@context': 'https://schema.org',
        '@type': place.isTouristDestination !== false ? 'TouristDestination' : 'Place',
        name: place.name || title,
        description: place.description || description,
        image: resolvedImage,
        url: canonicalUrl,
      };
      if (place.geo && (place.geo.lat || place.geo.lng)) {
        placeSchema.geo = {
          '@type': 'GeoCoordinates',
          latitude: place.geo.lat,
          longitude: place.geo.lng,
        };
      }
      if (place.address) {
        placeSchema.address = {
          '@type': 'PostalAddress',
          addressCountry: 'PK',
          addressRegion: place.address.region || place.region,
          addressLocality: place.address.locality || place.name,
        };
      }
      list.push(placeSchema);
    }

    // 4. NaturalFeature (Mountains, Rivers)
    if (naturalFeature) {
      list.push({
        '@context': 'https://schema.org',
        '@type': naturalFeature.type || 'NaturalFeature',
        name: naturalFeature.name || title,
        description: naturalFeature.description || description,
        image: resolvedImage,
        url: canonicalUrl,
        additionalProperty: naturalFeature.elevationMeters
          ? [
              {
                '@type': 'PropertyValue',
                name: 'Elevation',
                value: `${naturalFeature.elevationMeters} m`,
              },
            ]
          : naturalFeature.lengthKm
          ? [
              {
                '@type': 'PropertyValue',
                name: 'Length',
                value: `${naturalFeature.lengthKm} km`,
              },
            ]
          : undefined,
      });
    }

    // 5. FAQPage
    if (Array.isArray(faqItems) && faqItems.length > 0) {
      list.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      });
    }

    // 6. Custom or raw schema provided
    if (schema) {
      if (Array.isArray(schema)) {
        list.push(...schema);
      } else {
        list.push(schema);
      }
    }

    return list;
  }, [breadcrumbs, article, place, naturalFeature, faqItems, schema, title, description, canonicalUrl, resolvedImage]);

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      {keywords && <meta name="keywords" content={Array.isArray(keywords) ? keywords.join(', ') : keywords} />}

      {/* Open Graph Meta Tags (Facebook, LinkedIn, WhatsApp) */}
      <meta property="og:site_name" content={APP_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedImage} />

      {/* Dynamic JSON-LD Structured Data */}
      {jsonLdSchemas.map((s, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
