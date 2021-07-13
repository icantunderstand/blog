import React from "react"
import Header from "../components/header"
import { graphql } from "gatsby"
import { useSiteData } from '../hooks/site-data'
import { StaticImage } from 'gatsby-plugin-image'
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
      <div className="blog-footer">
        <StaticImage src="../post/images/qrcode.jpg" alt="" />
        <div>欢迎大家关注我的公众号-前端小板凳 一起学习进步！</div>
      </div>
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