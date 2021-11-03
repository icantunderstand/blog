import React, { useEffect } from "react"
import { graphql } from "gatsby"
import { StaticImage } from 'gatsby-plugin-image'
import Header from "../components/header"
import Comment from '../components/comment'
import { useSiteData } from '../hooks/site-data'
import './style.css'
import { sendPagePv } from '../utils'

export default function Template({ data }) {
  const { title, description } = useSiteData()
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark
  useEffect(() => {
    sendPagePv()
  }, [])
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
      <Comment />
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