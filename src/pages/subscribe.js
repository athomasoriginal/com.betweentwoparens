// Mailchimp Subscribe Form
//
// This is just a form, but configured to hit the mailchimp list
// "Between Two Parens".  Guide to self hosting forms:
// guide https://mailchimp.com/help/host-your-own-signup-forms/

import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'

const InputField = ({ type, name, value, id }) => {
  return <input type={type} name={name} value={value} id={id} />
}

const TextField = ({ label, type, name, value, id }) => {
  return (
    <div>
      <label for={id}>{label}</label>
      <InputField
        type={type}
        name={name}
        id={id}
        size="25"
        value={value}
        autocorrect="off"
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

  const fields = [userField, listField, firstNameField, emailField]
  return (
    <Layout>
      <SEO />
      <div className="subscribe">
        <h1 className="">Join Us</h1>
        <div>
          <img />
          <p>
            Join us to get notified when we come out with new content and course
            material
          </p>
        </div>
        <form action={postUrl}>
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
            value={firstNameField.value}
            id={firstNameField.id}
          />
          <TextField
            label={emailField.label}
            type={emailField.type}
            name={emailField.name}
            value={emailField.value}
            id={emailField.id}
          />
          <button>{submitBtn}</button>
        </form>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    site {
      siteMetadata {
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

// <!-- Begin Mailchimp Signup Form -->
// <link href="//cdn-images.mailchimp.com/embedcode/classic-10_7.css" rel="stylesheet" type="text/css">
// <style type="text/css">
// 	#mc_embed_signup{background:#fff; clear:left; font:14px Helvetica,Arial,sans-serif; }
// 	/* Add your own Mailchimp form style overrides in your site stylesheet or in this style block.
// 	   We recommend moving this block and the preceding CSS link to the HEAD of your HTML file. */
// </style>
// <div id="mc_embed_signup">
// <form action="https://betweentwoparens.us19.list-manage.com/subscribe/post?u=d3adf3b6f4d0d994623f9925f&amp;id=c6998a1564" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
//     <div id="mc_embed_signup_scroll">
// 	<h2>Subscribe</h2>
// <div class="indicates-required"><span class="asterisk">*</span> indicates required</div>
// <div class="mc-field-group">
// 	<label for="mce-FNAME">First Name </label>
// 	<input type="text" value="" name="FNAME" class="" id="mce-FNAME">
// </div>
// <div class="mc-field-group">
// 	<label for="mce-EMAIL">Email Address  <span class="asterisk">*</span>
// </label>
// 	<input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL">
// </div>
// 	<div id="mce-responses" class="clear">
// 		<div class="response" id="mce-error-response" style="display:none"></div>
// 		<div class="response" id="mce-success-response" style="display:none"></div>
// 	</div>    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
//     <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_d3adf3b6f4d0d994623f9925f_c6998a1564" tabindex="-1" value=""></div>
//     <div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button"></div>
//     </div>
// </form>
// </div>
// <script type='text/javascript' src='//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js'></script><script type='text/javascript'>(function($) {window.fnames = new Array(); window.ftypes = new Array();fnames[1]='FNAME';ftypes[1]='text';fnames[0]='EMAIL';ftypes[0]='email';}(jQuery));var $mcj = jQuery.noConflict(true);</script>
// <!--End mc_embed_signup-->
