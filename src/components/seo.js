import React from 'react'
import { Helmet } from 'react-helmet'
import favicon from '../assets/thomas.ico'

function SEO({
  description,
  lang,
  meta,
  title,
  author,
  ogURL,
  datePublished,
  dateModified,
  // object with keys: title, author, datePublished, description
  googleStructuredData,
  isBlogPost,
}) {
  return (
    <Helmet>
      <html lang={lang} />

      {/* General tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="image"
        content={`https://betweentwoparens.com/thomas-cartoon.jpeg`}
      />

      {/* OpenGraph tags */}
      <meta property="og:url" content={ogURL} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        property="og:image"
        content={`https://betweentwoparens.com/thomas-cartoon.jpeg`}
      />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={author} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content={`https://betweentwoparens.com/thomas-cartoon.jpeg`}
      />

      {/* Structured Data - https://developers.google.com/search/docs/data-types/article#non-amp*/}
      {isBlogPost ? (
        <script type="application/ld+json">{`
        {
            "@context": "http://schema.org",
            "@type": "Article",
            "name": ${title},
            "author": {
              "@type": "Person",
              "name": ${author}
            },
            "datePublished": ${datePublished},
            "dateModified": ${dateModified},
        }
    `}</script>
      ) : (
        false
      )}

      {/* stylesheets */}

      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Noto+Sans:400,700&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Playfair+Display&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300i,700&display=swap"
      />
      <link rel="shortcut icon" type="image/png" href={favicon} />
    </Helmet>
  )
}

export default SEO
