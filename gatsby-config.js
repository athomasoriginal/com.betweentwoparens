// feeds our app environment variables when it finds a .env.production or
// .env.development file
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    // title is used in the blog index page and the seoTitle is meant for the
    // meta tags in the blogs to help with seo.  Thus, title is to be visually
    // seen when people visit the site
    title: `Between Two Parens`,
    author: `Thomas Mattacchione`,
    description: `A blog about life between two parens`,
    seoTitle: `Between Two Parens - a blog on clojure, clojurescript and programming`,
    seoLang: `en`,
    seoDescription: `A blog about programming clojure, clojurescript and javascript for the purpose of teaching and learning`,
    ogURL: `https://www.betweentwoparens.com`,
    seokeywords: [`clojurescript`, `clojure`, `javascript`],
    // added for the RSS feed plugin
    siteUrl: `https://betweentwoparens.com`,
    license: {
      name: 'CC BY-NC',
      url: 'https://creativecommons.org/licenses/by-nc/4.0/',
    },
    footerlinks: [
      { title: 'Twitter', url: 'https://twitter.com/athomasoriginal' },
      { title: 'Youtube', url: 'https://www.youtube.com/channel/UCfBUN43AQoyGiQxmCIDZe2w/featured?view_as=subscriber' },
      { title: 'Github', url: 'https://github.com/athomasoriginal' },
      { title: 'Linkedin', url: 'https://www.linkedin.com/in/tmattacchione/' },
      { title: 'rss', url: `https://betweentwoparens.com/rss.xml`},
    ],
  },
  plugins: [
    `gatsby-plugin-feed`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              className: 'blog-post__anchor',
            },
          },
          {
            resolve: "gatsby-remark-external-links",
            options: {
              target: "_blank",
              rel: "noopener noreferrer"
            }
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'gatsby-code-',
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
        ],
      },
    },
    /**
     * Analytics
     */
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GATSBY_GA_TRACKING_ID,
        // Puts tracking script in the head instead of the body
        head: true,
        // Setting this parameter is optional
        anonymize: true,
        // Setting this parameter is also optional
        respectDNT: true,
      },
    },
  ],
}
