import React from 'react'
import Layout from '../components/layout'
import Footer from '../components/footer'
import Header from '../components/header'
import SEO from '../components/seo'
import { graphql } from 'gatsby'
import './prism-syntax-highlighting.css'

const TableOfContents = ({ toc }) => {
  // only return the TOC if there is one to return
  return toc !== '' ? (
    <aside className="blog-content__toc-wrapper">
      <div className="blog-content__toc">
        <p>This post covers the following topics: </p>
        <div
          dangerouslySetInnerHTML={{
            __html: toc,
          }}
        />
      </div>
    </aside>
  ) : (
    false
  )
}

const BlogHeading = ({ title, date }) => {
  return (
    <div className="blog-content__heading">
      <h2 className="blog-content__headline">{title}</h2>
      <p className="blog-content__byline">
        <span className="hide">posted on</span>
        <time className="blog-content__byline-time">{date}</time>
        <span className="blog-content__byline-divider" />
      </p>
    </div>
  )
}

const BlogContent = ({ html, footerLinks, license }) => {
  return (
    <div className="blog-content">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <Footer links={footerLinks} license={license} />
    </div>
  )
}

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
      <div className="blog-content__wrapper">
        <BlogHeading title={frontmatter.title} date={frontmatter.date} />
        <TableOfContents toc={data.markdownRemark.tableOfContents} />
        <BlogContent
          html={data.markdownRemark.html}
          footerLinks={siteMetadata.footerlinks}
          license={siteMetadata.license}
        />
      </div>
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
