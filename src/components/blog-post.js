import PropTypes from 'prop-types'
import React from 'react'

import { Link } from 'gatsby'

import './blog-post.css'

const BlogPost = ({ title, author, date, description, url }) => (
  <article className="blog-post-item">
    <header>
      <h2 className="blog-post-item__title">
        <Link className="blog-post-item__link" to={url}>
          {title}
        </Link>
      </h2>
    </header>
    <p className="blog-post-item__meta">
      <span className="blog-post-item__author">{author}</span>
      <span className="hide">posted on</span>
      <time>{date}</time>
    </p>
    <p className="blog-post-item__description">{description}</p>
  </article>
)

BlogPost.propTypes = {
  title: PropTypes.string,
  date: PropTypes.string,
  description: PropTypes.string,
}

BlogPost.defaultProps = {
  title: ``,
  date: '',
  description: '',
}

export default BlogPost
