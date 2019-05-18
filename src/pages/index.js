import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import ArticleIndexItem from '../components/article-index-item'
import Header from '../components/header'
import Footer from '../components/Footer'

const social_media_links = [
  { title: 'Github', url: 'https://github.com/tkjone/' },
  { title: 'Linkedin', url: 'https://www.linkedin.com/in/tmattacchione/' },
  { title: 'Twitter', url: 'https://twitter.com/tmkjone' },
]

const EmptyIndexScreenMsg = ({ msg }) => (
  <p className="no-articles-msg">{msg}</p>
)

const Articles = ({ articles }) => {
  return articles.map(article => {
    return (
      <ArticleIndexItem
        key={article.node.id}
        title={article.node.frontmatter.title}
        date={article.node.frontmatter.date}
        description={article.node.frontmatter.summary}
        url={article.node.fields.slug}
      />
    )
  })
}

const IndexPage = ({ data }) => {
  const siteMetadata = data.site.siteMetadata
  const articles = data.allMarkdownRemark.edges

  return (
    <Layout>
      <SEO
        title={siteMetadata.seoTitle}
        description={siteMetadata.seoDescription}
        author={siteMetadata.author}
        lang={siteMetadata.seoLang}
        ogURL={siteMetadata.ogURL}
        keywords={[`clojurescript`, `clojure`, `javascript`]}
      />
      <Header
        title={siteMetadata.title}
        name={siteMetadata.author}
        description={siteMetadata.description}
        interests={['Clojure', 'ClojureScript', 'JavaScript']}
      />
      {articles && articles.length ? (
        <Articles articles={articles} />
      ) : (
        <EmptyIndexScreenMsg msg="No articles yet" />
      )}
      <Footer links={social_media_links} />
    </Layout>
  )
}

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
        author
        description
        seoTitle
        seoDescription
        seoLang
        ogURL
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
            summary
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }
`

export default IndexPage
