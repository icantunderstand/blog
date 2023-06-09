
const path = require(`path`)
const pageConstants = require('./src/constants')
const createPaginatedPages = require('gatsby-paginate')

// 创建分类页面
function createCategoryPage({ actions, graphql }) {
  const { createPage } = actions
  const blogCategory = pageConstants.blogCategory
  for(let i = 0; i < blogCategory.length;i++) {
    const category = blogCategory[i];
    createPage({
      path: category.key,
      context: {
        category: category.key,
        meta: category?.meta
      },
      component: path.resolve(`src/templates/categoryDetail.js`),
    })
  }
}

// 创建详情页
async function createDetailPage({ actions, graphql }) {
  const { createPage } = actions
  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: {fields: frontmatter___date, order: DESC}
      ) {
        edges {
          node {
            id
            html
            fields {
              readingTime {
                text
              }
            }
            frontmatter {
              title
              date
              tags
              path
              top
              summary
            }
          }
        }
      }
    }
  `)
  if (result.errors) {
    console.error(result.errors)
  }
  // 做置顶逻辑
  const resultArr = []
  const allCount = result.data.allMarkdownRemark.edges.length
  result.data.allMarkdownRemark.edges.forEach(item => {
    const { node } = item || {}
    const { top, tags } = (node || {}).frontmatter
    if(top) {
      resultArr.unshift(item)
    } else {
      resultArr.push(item)
    }
  })
  result.data.allMarkdownRemark.edges = resultArr
  createPaginatedPages({
    edges: [...result.data.allMarkdownRemark.edges],
    createPage: createPage,
    pageTemplate: 'src/templates/index.js',
    pageLength: 6, // This is optional and defaults to 10 if not used
    pathPrefix: '', // This is optional and defaults to an empty string if not used
    context: { pageAllCount: allCount }, // This is optional and defaults to an empty object if not used
  });
  ([...result.data.allMarkdownRemark.edges]).forEach(({ node }) => {
    const readingTime = node?.fields?.readingTime?.text
    createPage({
      path: node.frontmatter.path,
      component: path.resolve(`src/templates/post.js`),
      context: { readingTime }
    })
  })
}
// 创建博客页面
exports.createPages = async ({ actions, graphql }) => {
  createCategoryPage({ actions, graphql })
  await createDetailPage({ actions, graphql })
}