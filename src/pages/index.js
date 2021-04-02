import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import Seo from '../components/seo'
import Blog from '../components/blog'
import Header from '../components/header'
import Footer from '../components/footer'

const Blogs = ({ blogPosts, emptyBlogMsg, footerLinks, license }) => {
  if (blogPosts && blogPosts.length) {
    return (
      <div className="stack">
        {blogPosts.map((blogPost) => {
          return (
            <Blog
              key={blogPost.node.id}
              title={blogPost.node.frontmatter.title}
              author={blogPost.node.frontmatter.author}
              date={blogPost.node.frontmatter.datePublished}
              description={blogPost.node.frontmatter.summary}
              url={blogPost.node.fields.slug}
            />
          )
        })}
        <Footer links={footerLinks} license={license} />
      </div>
    )
  } else {
    return (
      <div className="blogs">
        <p className="no-blog-posts-msg">{emptyBlogMsg}</p>
      </div>
    )
  }
}

const IndexPage = ({ data }) => {
  const siteMetadata = data.site.siteMetadata
  const blogPosts = data.allMarkdownRemark.edges

  return (
    <Layout
      className={'blog__home'}
      CustomHeader={
        <Header
          description={siteMetadata.description}
          navList={siteMetadata.headerLinks}
          isBlogLayout={false}
        />
      }
    >
      <Seo
        title={siteMetadata.seoTitle}
        description={siteMetadata.seoDescription}
        author={siteMetadata.author}
        lang={siteMetadata.seoLang}
        ogURL={siteMetadata.ogURL}
      />
      <Blogs
        blogPosts={blogPosts}
        emptyBlogMsg={'No blog posts yet'}
        footerLinks={siteMetadata.footerlinks}
        license={siteMetadata.license}
      />
    </Layout>
  )
}

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
        description
        seoTitle
        seoDescription
        seoLang
        interests
        ogURL
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
        license {
          name
          url
        }
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___datePublished], order: DESC }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            author
            datePublished(formatString: "DD MMMM, YYYY")
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
