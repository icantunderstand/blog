import React, { useEffect } from "react"
import { graphql } from "gatsby"
import { StaticImage } from 'gatsby-plugin-image'
import { 
  AppShell,
  createStyles,
} from '@mantine/core';


import Comment from '@components/comment'
import AdComponent from '@components/adComponent'
import PageHeader from '@components/PageHeader'
import './style.css'
import { sendPagePv } from '../utils'

const useStyles = createStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 70,
  }
}));

export default function Template({ data, pageContext = {} }) {
  const { readingTime } = pageContext
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark
  const { classes } = useStyles();

  useEffect(() => {
    sendPagePv()
  }, [])
  return (
    <AppShell
        padding="md"
        data-barba="wrapper"
        header={<PageHeader isDetailPage />}
        styles={(theme) => ({
          root: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
          main: { paddingTop: 20 }
        })}
    >
      <div className={classes.content}>

        <div className="blog-post">
          <h1 className="blog-post-content">{frontmatter.title}</h1>
          {readingTime && <div className="blog-post-content">{readingTime}</div>}
          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div className="blog-footer">
            <StaticImage src="../post/images/qrcode.jpg" alt="" />
            <div>欢迎大家关注我的公众号-前端小板凳 一起学习进步！</div>
          </div>
          <Comment />
          <AdComponent />
        </div>
      </div>
    </AppShell>
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