import React from "react"
import Header from "../components/header"
import { graphql } from "gatsby"
import { useSiteData } from '../hooks/site-data'
import './style.css'


export default function Template({ data }) {
  const { title, description } = useSiteData()
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark
  return (
    <div className="blog-post">
      <Header siteTitle={title} description={description} />
      <h1 className="blog-post-content">{frontmatter.title}</h1>
      <div
        className="blog-post-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date
        path
        title
      }
    }
  }
`