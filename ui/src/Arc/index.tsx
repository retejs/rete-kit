
import { useEffect, useRef } from 'react'
import { useQuery } from '../query';
import { createArc, Link, Node } from './d3';

type Data = ({
  group: 'nodes';
  data: Node;
} | {
  group: 'edges';
  data: Link;
})[]

export function Arc() {
  const ref = useRef(null);
  const { isPending, error, data } = useQuery<Data>({
    queryKey: ['graph'],
    queryFn: () => fetch('/api').then(res => res.json())
  })

  useEffect(() => {
    if (!ref.current) return
    if (!data) return

    console.log(data)

    const nodes: Node[] = data
      .filter(item => item.group === 'nodes')
      .map(item => ({
        id: item.data.id,
        name: item.data.id.split('/').pop()!,
        parent: item.data.parent,
        isCollapsed: true
      }))

    const links = data
      .filter(item => item.group === 'edges')
      .map(item => ({
        source: item.data.source,
        target: item.data.target,
        value: 1
      }))



    const nodesWithAtLeastOneLink = nodes
      // .filter(node => links.some(link => link.source === node.id || link.target === node.id))

    createArc(ref.current as SVGElement, nodesWithAtLeastOneLink, links)
  }, [ref.current, data])

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <svg ref={ref} />
    </div>
  )

}