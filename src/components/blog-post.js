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
    <div>
      <p className="blog-post-item__description">{description}</p>
      <span className="blog-post-item__description-hr"/>
    </div>
    <p className="blog-post-item__meta">
      <time className="blog-post-item__date">{date}</time>
      <span className="hide">posted on</span>
      <span className=""> BY </span>
      <span className="blog-post-item__author">{author}</span>
    </p>
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
