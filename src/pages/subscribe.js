// Mailchimp Subscribe Form
//
// This is just a form, but configured to hit the mailchimp list
// "Between Two Parens".  Guide to self hosting forms:
// guide https://mailchimp.com/help/host-your-own-signup-forms/

// todo prevent empty press click and handle post manually

import React, { useState } from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'

const InputField = ({ type, name, value, id, onChange }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      id={id}
      className="subscribe__input"
      onChange={onChange}
    />
  )
}

const TextField = ({ label, type, name, value, id, onChange }) => {
  return (
    <div className="subscribe__text-field">
      <label htmlFor={id} className="subscribe__input-label">
        {label}
      </label>
      <InputField
        type={type}
        name={name}
        id={id}
        size="25"
        value={value}
        autocorrect="off"
        onChange={onChange}
      />
    </div>
  )
}

const SubscribePage = ({ data }) => {
  const {
    postUrl,
    userField,
    listField,
    firstNameField,
    emailField,
    submitBtn,
  } = data.site.siteMetadata.subscribe

  const siteMetadata = data.site.siteMetadata

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [warning, setWarning] = useState('')
  const warningMsg = 'Please complete both the name and email field'

  // @note perform a quick validation for empty values and when values provided
  // we will just continue to submit the form.
  const handleSubmit = evt => {
    if (name === '' && email === '') {
      setWarning(warningMsg)
    } else {
      return true
    }
  }

  return (
    <Layout className="app-subscribe">
      <SEO
        title={siteMetadata.seoTitle}
        description={siteMetadata.seoDescription}
        author={siteMetadata.author}
        lang={siteMetadata.seoLang}
        ogURL={siteMetadata.ogURL}
        keywords={siteMetadata.seokeywords}
      />
      <div className="subscribe">
        <h1 className="h__base h__1 subscribe__title">Join Us</h1>
        <div className="subscribe__description">
          <img
            className="subscribe__description-avatar"
            src="/thomas-cartoon.jpeg"
            alt="Thomas Avatar"
          />
          <p className="subscribe__description-text">
            Join us to get notified when we come out with new content and course
            material
          </p>
        </div>
        <form action={postUrl} onSubmit={handleSubmit}>
          <InputField
            type={userField.type}
            name={userField.name}
            value={userField.value}
            id={userField.id}
          />
          <InputField
            type={listField.type}
            name={listField.name}
            value={listField.value}
            id={listField.id}
          />
          <TextField
            label={firstNameField.label}
            type={firstNameField.type}
            name={firstNameField.name}
            id={firstNameField.id}
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <TextField
            label={emailField.label}
            type={emailField.type}
            name={emailField.name}
            id={emailField.id}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button className="btn subscribe__btn">{submitBtn}</button>
        </form>
        <p className="subscribe__help-text">
          {warning ? warning : 'You can unsubscribe at any time'}
        </p>
      </div>
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

        subscribe {
          postUrl
          submitBtn
          userField {
            type
            name
            value
          }
          listField {
            type
            name
            value
          }
          firstNameField {
            label
            type
            name
            id
          }
          emailField {
            label
            type
            name
            id
          }
        }
      }
    }
  }
`

export default SubscribePage
