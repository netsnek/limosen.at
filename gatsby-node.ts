// gatsby-node.ts
import type { PageConfig } from 'jaen' // type-only to avoid runtime import
import type { GatsbyNode } from 'gatsby'
import path from 'path'
import {promises as fs} from 'fs' // no default import issues
import { buildSearchIndex } from './src/utils/search/build-search-index'

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions
}) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        // use cwd so it also works if __dirname isn't defined in ESM contexts
        '@/clients': path.resolve(process.cwd(), 'src/clients')
      }
    }
  })
}

export const onPostBuild: GatsbyNode['onPostBuild'] = async ({
  graphql,
  reporter
}) => {
  const result = await graphql<{
    allJaenPage: {
      nodes: Array<{
        id: string
        slug: string
        template: string | null
        buildPath?: string | null
        jaenPageMetadata?: { title?: string | null } | null
        jaenFields?: Record<string, any> | null
      }>
    }
  }>(`
    query BuildSearchIndexPages {
      allJaenPage {
        nodes {
          id
          slug
          template
          buildPath
          jaenPageMetadata {
            title
          }
          jaenFields
        }
      }
    }
  `)

  if (result.errors || !result.data) {
    reporter.panicOnBuild(`Error while running GraphQL query. ${result.errors}`)
    return
  }

  const { allJaenPage } = result.data
  await preparePagesAndBuildSearch(allJaenPage)
}

async function preparePagesAndBuildSearch(allJaenPage: {
  nodes: Array<{
    id: string
    slug: string
    template: string | null
    buildPath?: string | null
    jaenPageMetadata?: { title?: string | null } | null
    jaenFields?: Record<string, any> | null
  }>
}) {
  const nodesForSearchIndex = allJaenPage.nodes.map(node => {
    const originPath =
      (node.buildPath && node.buildPath.length > 0)
        ? node.buildPath
        : node.slug
        ? `/${node.slug}`
        : '/'

    let type = node.template ?? undefined
    if (type && path.extname(type)) {
      type = path.basename(type, path.extname(type))
    }

    return {
      id: node.id,
      path: originPath,
      jaenPageMetadata: node.jaenPageMetadata ?? {},
      jaenFields: node.jaenFields ?? {},
      type
    }
  })

  const searchIndex = await buildSearchIndex(nodesForSearchIndex as any)

  await fs.writeFile(
    path.join('public', 'search-index.json'),
    JSON.stringify(searchIndex)
  )
}
