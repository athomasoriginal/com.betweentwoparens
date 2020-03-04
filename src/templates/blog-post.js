import React from 'react'
import Layout from '../components/layout'
import Footer from '../components/footer'
import Header from '../components/header'
import SEO from '../components/seo'
import { graphql } from 'gatsby'
import './blog-post.css'

export default ({ data }) => {
  const siteMetadata = data.site.siteMetadata
  const { frontmatter } = data.markdownRemark

  return (
    <Layout>
      <SEO
        title={frontmatter.title}
        description={frontmatter.summary}
        author={frontmatter.author}
        lang={siteMetadata.seoLang}
        ogURL={`${siteMetadata.ogURL}/${frontmatter.slug}`}
        keywords={frontmatter.keywords}
      />
      <Header
        title={siteMetadata.title}
        name={siteMetadata.author}
        description={false}
        navList={siteMetadata.headerLinks}
      />
      <div className="blog-post__content-wrapper">
        <div className="blog-post__title-wrapper">
          <h2 className="blog-post__title">{frontmatter.title}</h2>
          <p className="blog-post__meta">
            <span className="hide">posted on</span>
            <time>{frontmatter.date}</time>
            <span className="blog-post__meta-hr" />
          </p>
        </div>
        <div
          className="blog-post__content"
          dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}
        />
      </div>
      <aside className="blog-post__toc-wrapper">
        <div className="blog-post__toc">
          <p>This post covers the following topics: </p>
          <div
            dangerouslySetInnerHTML={{
              __html: data.markdownRemark.tableOfContents,
            }}
          />
        </div>
      </aside>
      <Footer links={siteMetadata.footerlinks} license={siteMetadata.license} />
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    site {
      siteMetadata {
        title
        ogURL
        description
        seoLang
        license {
          name
          url
        }
        headerLinks {
          title
          url
          iconName
          isInternalLink
        }
        footerlinks {
          title
          url
          iconName
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      tableOfContents(maxDepth: 2)
      frontmatter {
        title
        summary
        author
        slug
        date(formatString: "DD MMMM, YYYY")
        keywords
      }
    }
  }
`
