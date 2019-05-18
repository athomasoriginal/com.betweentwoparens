/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`)

const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  const fileNode = getNode(node.parent)

  if (node.internal.type === `MarkdownRemark`) {
    const parsedFilePath = path.parse(fileNode.relativePath)

    // @note handles custom slug names.  When a markdown file has `slug` in the
    //       frontmatter this is what loofartks for it and applies it to the slug
    //       so we can have custom slugs.  When no slug found, we revert to the
    //       default behaviour
    let slug

    if (node.frontmatter && node.frontmatter.slug) {
      slug = `/${node.frontmatter.slug}`
    } else {
      slug = createFilePath({ node, getNode, basePath: `pages` })
    }

    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
  // @note The graphql function call returns a Promise
  const { createPage } = actions

  return graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `).then(result => {
    const posts = result.data.allMarkdownRemark.edges

    posts.forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: path.resolve(`./src/templates/blog-post.js`),
        context: {
          // Data passed to context is available
          // in page queries as GraphQL variables.
          slug: node.fields.slug,
        },
      })
    })
  })
}
