
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
      path: category,
      context: {
        category,
      },
      component: path.resolve(`src/templates/category.js`),
    })
  }
  
}
// 创捷详情页
async function createDetailPage({ actions, graphql }) {
  const { createPage } = actions
  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              path,
              title,
              date,
            }
          }
        }
      }
    }
  `)
  if (result.errors) {
    console.error(result.errors)
  }
  createPaginatedPages({
    edges: result.data.allMarkdownRemark.edges,
    createPage: createPage,
    pageTemplate: 'src/templates/index.js',
    pageLength: 15, // This is optional and defaults to 10 if not used
    pathPrefix: '', // This is optional and defaults to an empty string if not used
    context: {}, // This is optional and defaults to an empty object if not used
  })
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.path,
      component: path.resolve(`src/templates/post.js`),
    })
  })
}
// 创建博客页面
exports.createPages = async ({ actions, graphql }) => {
  createCategoryPage({ actions, graphql })
  await createDetailPage({ actions, graphql })
}