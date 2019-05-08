import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import ArticleIndexItem from '../components/article-index-item'
import AuthorAvatar from '../components/author-avatar'
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
  const articles = data.allMarkdownRemark.edges

  return (
    <Layout>
      <SEO title="Home" keywords={[`clojurescript`, `clojure`, `javascript`]} />
      <AuthorAvatar
        name="Thomas Mattacchione"
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
