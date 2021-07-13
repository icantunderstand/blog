import { useStaticQuery, graphql } from "gatsby"

export const useSiteData = () => {
  const { site } = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title,
          description,
        }
      }
    }
  `)
  return site.siteMetadata;
}

