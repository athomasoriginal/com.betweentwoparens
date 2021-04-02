import React from 'react'
import Layout from '../components/layout'
import Footer from '../components/footer'
import Header from '../components/header'
import Seo from '../components/seo'
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

const BlogHeading = ({ title, datePublished, dateModified }) => {
  return (
    <div className="blog-content__heading">
      <h2 className="blog-content__headline">{title}</h2>
      <div className="blog-content__byline">
        <div className="blog-content__byline-time-wrapper">
          <p className="">
            posted on
            <time className="blog-content__byline-time"> {datePublished} </time>
            and last updated
            <time className="blog-content__byline-time"> {dateModified} </time>
          </p>
        </div>
        <span className="blog-content__byline-divider" />
      </div>
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

const BlogPage = ({ data }) => {
  const siteMetadata = data.site.siteMetadata
  const { frontmatter } = data.markdownRemark

  return (
    <Layout
      CustomHeader={
        <Header
          description={false}
          navList={siteMetadata.headerLinks}
          isBLogLayout={true}
        />
      }
    >
      <Seo
        title={frontmatter.title}
        description={frontmatter.summary}
        author={frontmatter.author}
        lang={siteMetadata.seoLang}
        ogURL={`${siteMetadata.ogURL}/${frontmatter.slug}`}
        datePublished={frontmatter.datePublished}
        dateModified={frontmatter.dateModified}
        isBlogPost={true}
      />
      <div className="blog-content__wrapper">
        <BlogHeading
          title={frontmatter.title}
          datePublished={frontmatter.datePublished}
          dateModified={frontmatter.dateModified}
        />
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

export default BlogPage

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
      tableOfContents(
        maxDepth: 2
        absolute: false
      )
      frontmatter {
        title
        summary
        author
        slug
        datePublished(formatString: "DD MMMM, YYYY")
        dateModified(formatString: "DD MMMM, YYYY")
      }
    }
  }
`
