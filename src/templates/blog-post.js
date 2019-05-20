import React from 'react'
import Layout from '../components/layout'

import { graphql, Link } from 'gatsby'

import './blog-post.css'

export default ({ data }) => {
  const siteMetadata = data.site.siteMetadata
  const post = data.markdownRemark

  return (
    <Layout>
      <h1 className="site-title">
        <Link className="site-title__link" to={'/'}>
          {siteMetadata.title}
        </Link>
      </h1>
      <h2 className="blog-post__title">{post.frontmatter.title}</h2>
      <p className="blog-post-item__meta">
        <span className="hide">posted on</span>
        <time>{post.frontmatter.date}</time>
      </p>
      <div
        className="blog-post__content"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "DD MMMM, YYYY")
      }
    }
  }
`
