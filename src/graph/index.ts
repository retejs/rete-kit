import http from 'http'

import { toCytoscape } from './cytoscape'
import { drawGraph } from './mermaid'
import { getPackagesGraph } from './packages'
import { getSourceCodeGraph, toMermaid } from './source-code'

export type GraphSource = 'code' | 'packages'
export type GraphType = 'mermaid' | 'cytoscape'

type Options = {
  source: GraphSource
} & ({
  output: string
  type: Extract<GraphType, 'mermaid'>
} | {
  type: Extract<GraphType, 'cytoscape'>
})

function serveJSONData<T>(data: T) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const server = http.createServer((_req, res) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(data))
  })

  server.listen(3000)
  console.log('Server running at http://localhost:3000/')
}

export async function graph(options: Options) {
  const data = options.source === 'code'
    ? getSourceCodeGraph()
    : await getPackagesGraph(['..'])

  if (typeof data === 'string') {
    if (options.type === 'mermaid') {
      await drawGraph(data, options.output)
    }
  } else {
    if (options.type === 'cytoscape') {
      const { nodes, edges } = toCytoscape(data.tree, data.relations)

      serveJSONData([
        ...nodes.map(node => ({
          group: 'nodes',
          data: node
        })),
        ...edges.map(edge => ({
          group: 'edges',
          data: edge
        }))
      ])
    }
    if (options.type === 'mermaid') {
      await drawGraph(toMermaid(data.tree, data.relations), options.output)
    }
  }
}
