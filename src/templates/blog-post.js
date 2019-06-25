import React from 'react'
import Layout from '../components/layout'
import SEO from '../components/seo'

import { graphql, Link } from 'gatsby'

import './blog-post.css'

function LeftArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-arrow-left"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

export default ({ data }) => {
  const siteMetadata = data.site.siteMetadata
  const post = data.markdownRemark

  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.summary}
        author={post.frontmatter.author}
        lang={siteMetadata.seoLang}
        ogURL={`${siteMetadata.ogURL}/${post.frontmatter.slug}`}
        keywords={[`clojurescript`, `clojure`, `javascript`]}
      />
      <h1 className="site-title">
        <Link className="site-title__post-link" to={'/'}>
          <LeftArrowIcon />
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
        ogURL
        seoLang
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        summary
        author
        slug
        date(formatString: "DD MMMM, YYYY")
      }
    }
  }
`
