/* eslint-disable @typescript-eslint/naming-convention */
import './App.css'

import { message, Spin } from 'antd'
import cytoscape from 'cytoscape'
// @ts-expect-error no d.ts file
import cise from 'cytoscape-cise'
// @ts-expect-error no d.ts file
import cola from 'cytoscape-cola'
// @ts-expect-error no d.ts file
import coseBilkent from 'cytoscape-cose-bilkent'
// @ts-expect-error no d.ts file
import dagre from 'cytoscape-dagre'
// @ts-expect-error no d.ts file
import elk from 'cytoscape-elk'
// @ts-expect-error no d.ts file
import klay from 'cytoscape-klay'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'

import { QueryProvider, useQuery } from './query'

cytoscape.use(dagre)
cytoscape.use(cola)
cytoscape.use(coseBilkent)
cytoscape.use(klay)
cytoscape.use(elk)
cytoscape.use(cise)

const GraphContainer = styled.div`
  width: 100%;
  height: 100%;
`

function Cytoscape() {
  const cyRef = useRef(null)
  const [messageApi, contextHolder] = message.useMessage()

  const { isPending, error, data } = useQuery({
    queryKey: ['graph'],
    queryFn: () => fetch('/api').then(res => res.json())
  })

  useEffect(() => {
    if (error) {
      messageApi.error('Failed to fetch data')
    }
  }, [messageApi, error])

  useEffect(() => {
    if (!cyRef.current) throw new Error('cyRef is not loaded')
    if (!data) return

    function color(el: any) {
      if (el.source().data('parent') === el.target().data('parent')) {
        return 'green'
      }

      return 'grey'
    }

    const cy = cytoscape({
      container: cyRef.current,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            shape: 'rectangle',
            content: 'data(name)',
            'text-valign': 'center',
            'text-halign': 'center',
            width: '120px',
            height: '30px'
          }
        },

        {
          selector: ':parent',
          style: {
            'text-valign': 'top',
            'background-opacity': 0.333
          }
        },

        {
          selector: 'edge',
          style: {
            width: 3,
            // 'line-color': color,
            'line-fill': 'linear-gradient',
            'line-gradient-stop-colors': ['white', 'green'],
            'line-gradient-stop-positions': [0, 100],
            // 'line-opacity': el => {
            //   if (el.data('source').includes('node_modules')) {
            //     return 0.3
            //   }

            //   return 1
            // },
            'curve-style': 'bezier',
            // 'target-arrow-color': color,
            'target-arrow-shape': 'triangle'
          }
        }
      ],
      elements: data // .filter(n => n.group === 'nodes')
    })

    cy.nodes().forEach(node => {
      node.css('width', (node.data('name') as string).length * 10)
    })

    // https://d3-graph-gallery.com/arc.html
    // https://mbostock.github.io/d3/talk/20111116/bundle.html

    cy.layout({
      name: 'elk',
      elk: {
        algorithm: 'layered',
        'elk.edgeRouting': 'ORTHOGONAL',  // or 'POLYLINE' / 'SPLINES'
        'elk.spacing.edgeNode': 50
      },
      priority: edge => {
        if (edge.data('source').includes('node_modules')) {
          return 1
        }

        return 0
      }
    }).run()

    return () => {
      cy.destroy()
    }
  }, [data])

  return (
    <>
      {contextHolder}
      {/* <Spin spinning={isPending} tip='Loading...' /> */}
      <GraphContainer ref={cyRef}/>
    </>
  )
}

export function Graph() {
  return (
    <Cytoscape />
  )
}

