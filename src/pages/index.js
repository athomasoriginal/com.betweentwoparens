import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import BlogPost from '../components/blog-post'
import Header from '../components/header'
import Footer from '../components/footer'


const EmptyIndexScreenMsg = ({ msg }) => (
  <p className="no-blog-posts-msg">{msg}</p>
)

const BlogPosts = ({ blogPosts }) => {
  return blogPosts.map(blogPost => {
    return (
      <BlogPost
        key={blogPost.node.id}
        title={blogPost.node.frontmatter.title}
        author={blogPost.node.frontmatter.author}
        date={blogPost.node.frontmatter.date}
        description={blogPost.node.frontmatter.summary}
        url={blogPost.node.fields.slug}
      />
    )
  })
}

const IndexPage = ({ data }) => {
  const siteMetadata = data.site.siteMetadata
  const blogPosts = data.allMarkdownRemark.edges

  return (
    <Layout>
      <SEO
        title={siteMetadata.seoTitle}
        description={siteMetadata.seoDescription}
        author={siteMetadata.author}
        lang={siteMetadata.seoLang}
        ogURL={siteMetadata.ogURL}
        keywords={siteMetadata.seokeywords}
      />
      <Header
        title={siteMetadata.title}
        name={siteMetadata.author}
        description={siteMetadata.description}
        interests={siteMetadata.seokeywords}
        navList={siteMetadata.headerLinks}
      />
      {blogPosts && blogPosts.length ? (
        <BlogPosts blogPosts={blogPosts} />
      ) : (
        <EmptyIndexScreenMsg msg="No blog posts yet" />
      )}
      <Footer links={siteMetadata.footerlinks} license={siteMetadata.license} />
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
        seokeywords
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
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            author
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
