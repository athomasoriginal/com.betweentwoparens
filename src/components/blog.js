import React from 'react'
import { Link } from 'gatsby'
import './blog.css'

const Blog = ({ title, author, date, description, url }) => (
  <article className="blog">
    <header>
      <h2 className="blog__title">
        <Link className="blog__link" to={url}>
          {title}
        </Link>
      </h2>
    </header>
    <div>
      <p className="blog__description">{description}</p>
      <span className="blog__description-hr"/>
    </div>
    <p className="blog__meta">
      <time className="blog__date">{date}</time>
      <span className="hide">posted on</span>
      <span className=""> BY </span>
      <span className="blog__author">{author}</span>
    </p>
  </article>
)

export default Blog
