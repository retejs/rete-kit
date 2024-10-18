/* eslint-disable @stylistic/multiline-comment-style */
import { dirBgColorPalette, Item, Relation } from './source-code'

export interface CyNode {
  id: string
  name: string
  parent?: string
}

function toNode(item: Item, parent?: string): CyNode[] {
  const node = {
    id: item.path,
    name: item.name,
    parent,
    color: dirBgColorPalette[item.path.split('/').length]
  }

  if (item.type === 'dir') {
    return [
      node,
      ...item.children.flatMap(child => toNode(child, item.path))
    ]
  }

  return [node]
}

function toEdges(relations: Relation[]) {
  return relations
    .filter((relation, index, self) => {
      return self.findIndex(r => r.source === relation.source && r.target === relation.target) === index
    })
    .map(relation => ({
      id: `${relation.source}-${relation.target}`,
      source: relation.source,
      target: relation.target
    }))
}

// const relationsCache = new Set()

// function filterRelations(relations: Relation[], item: Item | null) {
//   const parent = item
//     ? item.path
//       .split('/')
//       .slice(0, -1)
//       .join('/')
//     : ''

//   const list = relations.filter(r => {
//     const sourcePath = r.source.split('/')
//     const targetPath = r.target.split('/')
//     const commonParent = sourcePath
//       .filter((_, i) => sourcePath[i] === targetPath[i])
//       .join('/')

//     return !relationsCache.has(r) && parent === commonParent
//   })

//   list.forEach(rel => relationsCache.add(rel))

//   return list
// }

// function debugTree(item: Item, relations: Relation[]) {
//   const children = 'children' in item
//     ? item.children.map(child => {
//       return debugTree(child, relations)
//     })
//     : undefined
//
//   return {
//     id: item.path,
//     width: 30,
//     height: 30,
//     children,
//     edges: toEdges(filterRelations(relations, item))
//   }
// }

export function toCytoscape(tree: Item[], relations: Relation[]) {
  // const edges = toEdges(filterRelations(relations, null))

  // console.log(JSON.stringify({
  //   id: 'root',
  //   children: tree.map(item => debugTree(item, relations)),
  //   edges
  // }))

  return {
    nodes: tree.flatMap(item => toNode(item)),
    edges: toEdges(relations)
  }
}
