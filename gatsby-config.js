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
    seoDescription: `A blog about programming clojure, clojurescript and javascript`,
    ogURL: `https://www.betweentwoparens.com`,
    interests: [`clojurescript`, `clojure`, `javascript`],
    // added for the RSS feed plugin
    siteUrl: `https://betweentwoparens.com`,
    license: {
      name: 'CC BY-NC',
      url: 'https://creativecommons.org/licenses/by-nc/4.0/',
    },
    headerLinks: [
      {
        title: 'Articles',
        url: '/',
        iconName: '',
        isInternalLink: true
      },
      {
        title: 'Subscribe',
        url: '/subscribe',
        iconName: '',
        isInternalLink: true
      },
      {
        title: 'Contact',
        url: 'mailto:thomasmattacchione@gmail.com?Subject=Hi%20Thomas',
        iconName: '',
        isInternalLink: false
      },
      {
        title: 'Youtube',
        url:
          'https://www.youtube.com/channel/UCfBUN43AQoyGiQxmCIDZe2w/featured?view_as=subscriber',
        iconName: 'youtube',
        isInternalLink: false
      },
    ],
    footerlinks: [
      {
        title: 'Twitter',
        url: 'https://twitter.com/athomasoriginal',
        iconName: 'twitter',
      },
      {
        title: 'Youtube',
        url:
          'https://www.youtube.com/channel/UCfBUN43AQoyGiQxmCIDZe2w/featured?view_as=subscriber',
        iconName: 'youtube',
      },
      {
        title: 'Git',
        url: 'https://github.com/athomasoriginal',
        iconName: 'git',
      },
      {
        title: 'Linkedin',
        url: 'https://www.linkedin.com/in/tmattacchione/',
        iconName: 'linkedin',
      },
      {
        title: 'rss',
        url: `https://betweentwoparens.com/rss.xml`,
        iconName: 'rss',
      },
    ],
    subscribe: {
      postUrl: 'https://betweentwoparens.us19.list-manage.com/subscribe/post',
      userField: {
        type: 'hidden',
        name: 'u',
        value: 'd3adf3b6f4d0d994623f9925f',
      },
      listField: {
        type: 'hidden',
        name: 'id',
        value: 'c6998a1564',
      },
      firstNameField: {
        label: 'First Name: ',
        type: 'text',
        name: 'MERGE1',
        id: 'MERGE1',
      },
      emailField: {
        label: 'Email: ',
        type: 'email',
        name: 'MERGE0',
        id: 'MERGE0',
      },
      submitBtn: 'Subscribe',
    }
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
              className: 'blog-content__section-link',
            },
          },
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
              rel: 'noopener noreferrer',
            },
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
  ],
}
