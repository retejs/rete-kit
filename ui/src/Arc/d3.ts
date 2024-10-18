import * as d3 from 'd3'

export type Node = {
  id: string;
  name: string;
  parent: string | null;
  isCollapsed?: boolean;
}

export type Link = {
  source: string;
  target: string;
  value: number;
}

export function createArc(svgElement: SVGElement, nodes: Node[], links: Link[]) {
  const labelFontSize = 14;
  const step = labelFontSize * 1.6;
  const marginTop = 10;
  const marginBottom = 10;
  const collapseSize = 10;
  const collapsemargin = 10;
  const getLabelMargin = (nodes: Node[]) => {
    return nodes
      .flatMap(({id}) => ({ text: id.split('/').pop() }))
      .map(({ text }) => text?.length || 0)
      .reduce((a, b) => {
        return Math.max(a, b)
      }) *  labelFontSize * 0.6
  }
  const getMarginLeft = (nodes: Node[]) => collapsemargin + collapseSize + getLabelMargin(nodes)
  const arcWidthCoef = 0.5
  const getHeight = (nodes: Node[]) => (nodes.length - 1) * step + marginTop + marginBottom;
  const getWidth = (nodes: Node[]) => {
    const weightWidth = 200;

    return getMarginLeft(nodes) + Math.max(weightWidth, getHeight(nodes) / 2 * arcWidthCoef)
  }
  const color = '#aaa';
  let focused: Node | null = null;

  function getY(nodes: Node[]) {
    return d3.scalePoint(d3.sort(nodes.map((d) => d.id)), [marginTop, getHeight(nodes) - marginBottom]);
  }
  let y = getY(nodes)

  // Create the SVG container.
  const svg = d3.select(svgElement)

  function updateBox(nodes: Node[]) {
    const width = getWidth(nodes)
    const height = getHeight(nodes)

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto;')
  }

  updateBox(nodes)
  svg.selectAll('*').remove()

  let Y = new Map(nodes.map(({id}) => [id, y(id)]));

  function arc(d: {
    source: string;
    target: string;
    value: number;
  }, nodes: Node[]) {
    const y1 = Y.get(d.source)!;
    const y2 = Y.get(d.target)!;
    const r = Math.abs(y2 - y1) / 2;
    const marginLeft = getMarginLeft(nodes)

    return `
      M ${marginLeft} ${y1}
      A ${r * arcWidthCoef} ${r} 0 0 ${y1 < y2 ? 1 : 0} ${marginLeft} ${y2}`;
  }


  const pathGroup = svg.insert('g', '*')
  let path: d3.Selection<d3.BaseType | SVGPathElement, Link, SVGGElement, unknown>

  function updateLinks(allNodes: Node[], visibleNodes: Node[], links: Link[]) {
    const reroutedLinks = links.map(link => {
      const { source, target } = link;

      const getNearestVisibleParent = (id: string) => {
        let currentNode = nodes.find(node => node.id === id);
        while (currentNode && !visibleNodes.includes(currentNode)) {
          currentNode = nodes.find(node => node.id === currentNode?.parent);
        }
        return currentNode ? currentNode.id : id;
      };

      const newSource = getNearestVisibleParent(source);
      const newTarget = getNearestVisibleParent(target);

      return { ...link, source: newSource, target: newTarget };
    });
    function removeDuplicates(links: Link[]) {
      return links
        .filter((link, index) => {
          return (
            index ===
            links.findIndex(
              l =>
                l.source === link.source &&
                l.target === link.target
            )
          );
        })
    }
    const agregatedLinks = removeDuplicates(reroutedLinks);

    path = pathGroup
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1.5)
      .selectAll('path')
      .data(agregatedLinks)
      .join('path')
      .attr('stroke', color)
      .attr('d', d => arc(d, visibleNodes));

    const weights = visibleNodes
      .flatMap(node => [{ node, type: 'outgoing' }, { node, type: 'incoming' }])
      .map(({ node, type }) => {
        return {
          node,
          type,
          count: agregatedLinks.filter(link => link[type === 'outgoing' ? 'source' : 'target'] === node.id).length
        }
      })

    pathGroup.selectAll('rect')
      .data(weights)
      .join('rect')
      .attr('x', d => {
        const marginLeft = getMarginLeft(visibleNodes)

        return marginLeft + 10
      })
      .attr('y', d => {
        const y = Y.get(d.node.id)!;
        return y - (d.type === 'outgoing' ? 3 : 0);
      })
      .attr('width', d => 190 * d.count / agregatedLinks.length)
      .attr('height', 3)
      .attr('fill', d => (d.type === 'outgoing' ? '#ff5e5e' : '#7dcb33'))
      .on('click', (event, d) => {
        console.log('Path clicked:', d);
      });
    }


  function getParents(id: Node['id'], nodes: Node[]): string[] {
    const node = nodes.find(n => n.id === id);
    if (!node?.parent) return [];
    return [node.parent, ...getParents(node.parent, nodes)];
  }
  // function getChildrenRecursively(id: Node['id'], nodes: Node[]): string[] {
  //   const children = nodes.filter(n => n.parent === id);
  //   return children.reduce<string[]>((acc, child) => {
  //     return [...acc, child.id, ...getChildrenRecursively(child.id, nodes)];
  //   }, []);
  // }

  function getVisibleNodes() {
    const collapsed = nodes.filter(node => node.isCollapsed)

    return nodes.filter(node => {
      const parents = getParents(node.id, nodes)

      return !collapsed.some(c => parents.includes(c.id))
    })
  }

  function updateCollapsed() {
    const visibleNodes = getVisibleNodes()
    updateBox(visibleNodes)
    updateNodes(visibleNodes)
    updateLinks(nodes, visibleNodes, links)
    updateFocused(nodes, visibleNodes)
  }

  const labelGroup = svg.append('g')
  let label: d3.Selection<d3.BaseType | SVGGElement, Node, SVGGElement, unknown>;

  updateCollapsed()

  function updateNodes(visibleNodes: Node[]) {
    y = getY(visibleNodes)
    Y = new Map(visibleNodes.map(({id}) => [id, y(id)]));

    const marginLeft = getMarginLeft(visibleNodes)

    labelGroup.selectAll('*').remove()
    label = labelGroup.attr('font-family', 'sans-serif')
      .attr('font-size', labelFontSize)
      .selectAll('g')
      .data(visibleNodes)
      .join('g')
        .attr('transform', d => `translate(${marginLeft},${Y.get(d.id)})`)
        .call(g => g.append('text')
            .attr('x', d => {
              const level = d.id.split('/').length - 1

              return -getLabelMargin(visibleNodes) + level * 6
            })
            .attr('dy', '0.35em')
            .attr('fill', () => d3.lab(color).darker(2))
            .text(d => {
              return d.name
            }))
        .call(g => g.append('circle')
            .attr('r', 3)
            .attr('fill', color))
        .call(g => {
          const group = g.append('g')
            .attr('class', 'collapse-toggle')
            .attr('display', d => d.name.endsWith('.ts') ? 'none' : '')
            .attr('transform', d => {
              const x = -marginLeft + d.id.split('/').length * 6;
              const y = -collapseSize / 2;
              return `translate(${x}, ${y})`;
            })
            .on('click', (event, d) => {
              d.isCollapsed = !d.isCollapsed;
              updateCollapsed()
            })

          group.append('rect')
            .attr('width', collapseSize)
            .attr('height', collapseSize)
            .attr('fill', '#a3a3a3')

          group.append('rect')
            .attr('x', 2)
            .attr('y', 4.5)
            .attr('width', 6)
            .attr('height', 1)
            .attr('fill', 'white')

          group.append('rect')
            .attr('x', 4.5)
            .attr('y', 2)
            .attr('width', 1)
            .attr('height', 6)
            .attr('fill', 'white')
            .attr('style', d => d.isCollapsed ? '' : 'display: none;')

          return g
        })
        .call(g => g.append('rect')
          .attr('width', marginLeft)
          .attr('height', step)
          .attr('x', d => -marginLeft + collapseSize + d.id.split('/').length * 6)
          .attr('y', -step / 2)
          .attr('fill', 'none')
          .attr('pointer-events', 'all')
          .on('click', (event, d) => {
            updateFocused(nodes, visibleNodes, d);
          })
        )
  }
  function updateFocused(allNodes: Node[], visibleNodes: Node[], node?: Node) {
    if (focused === node) {
      focused = null;
    } else if (typeof node !== 'undefined') {
      focused = node;
    } else if (focused) {
      console.log('focused', focused, getParents(focused.id, allNodes))
      focused = getParents(focused.id, allNodes)
        .map(id => allNodes.find(n => n.id === id))
        .filter((node): node is Node => Boolean(node))
        .find(n => n.isCollapsed) || null;
    }

    const current = focused;

    if (current === null) {
      svg.classed('hover', false);
      label.classed('primary', false);
      label.classed('secondary', false);
      path.classed('primary', false).order();
    } else {
      svg.classed('hover', true);
      label.classed('primary', n => n === current);
      label.classed('secondary', n => links.some(({source, target}) => {
        return n.id === source && current.id == target || n.id === target && current.id === source
      }));
      path.classed('primary animated', l => l.source === current.id || l.target === current.id).filter('.primary').raise();
      path.classed('incoming', l => l.target === current.id);
      path.classed('outgoing', l => l.source === current.id);
    }
  }

  // Add styles for the hover interaction.
  svg.append('style').text(`
    .collapse-toggle {
      cursor: pointer;
    }
    .collapse-toggle text {
      stroke: white;
    }
    .hover text { fill: #aaa; }
    .hover g.primary text { font-weight: bold; fill: #333; }
    .hover g.secondary text { fill: #333; }
    .hover path { stroke: #ccc; }
    .hover path.primary { stroke: #333; }

    .hover path.animated {
      stroke-dasharray: 5;
      stroke-dashoffset: 30;
      animation: dash 1s linear infinite;
    }

    .hover path.incoming {
      stroke: green;
      stroke-width: 3;
    }
    .hover path.outgoing {
      stroke: red;
      stroke-width: 2;
    }
    @keyframes dash {
      to {
        stroke-dashoffset: 0;
      }
    }
  `);

  return svg.node();
}
