import { basename, dirname, relative, resolve } from 'path'
import { CallExpression, Project, SourceFile, SyntaxKind } from 'ts-morph'

type Dir = { name: string, path: string, children: Item[], type: 'dir' }
type File = { name: string, path: string, type: 'file' }
export type Item = Dir | File
export type Relation = { source: string, target: string }

export const dirBgColorPalette = [
  // different colors that contrast with each other
  'lightgreen',
  'lightblue',
  'lightcoral',
  'lightcyan',
  'lightgoldenrodyellow',
  'lightgray'
]

function getDirs(files: string[]) {
  const dirs = new Set<string>([''])

  for (const sourceFile of files) {
    const dir = dirname(sourceFile) === '.'
      ? ''
      : dirname(sourceFile)

    dirs.add(dir)

    const segments = dir.split('/')

    for (let i = 1; i < segments.length; i++) {
      const parentDir = segments.slice(0, i).join('/')

      dirs.add(parentDir)
    }
  }

  return Array.from(dirs)
}

function isDynamicImport(callExpr: CallExpression) {
  return callExpr.getExpression().isKind(SyntaxKind.ImportKeyword)
    || callExpr.getExpression().isKind(SyntaxKind.RequireKeyword)
}

function getDynamicImportSourceFile(project: Project, current: SourceFile, callExpr: CallExpression) {
  if (!isDynamicImport(callExpr)) throw new Error('Call expression is not an import')

  const argument = callExpr.getArguments()[0]

  if (argument.isKind(SyntaxKind.StringLiteral)) {
    const path = resolve(dirname(current.getFilePath()), argument.getLiteralValue())
    const pathLikeFolder = resolve(path, 'index.ts')

    return project.getSourceFile(path)
      ?? project.getSourceFile(pathLikeFolder)
      ?? null
  }
  return null
}

function getRelations(project: Project, sourceFiles: SourceFile[]) {
  const relations: Relation[] = []

  for (const sourceFile of sourceFiles) {
    const modulePath = sourceFile.getFilePath()
    const imports = sourceFile.getImportDeclarations()
      .map(d => d.getModuleSpecifierSourceFile())
      .filter((sf): sf is SourceFile => Boolean(sf))
      .map(sf => sf.getFilePath())
      .map(path => relative(process.cwd(), path))

    const dynamicImports = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)
      .filter(isDynamicImport)
      .map(callExpr => getDynamicImportSourceFile(project, sourceFile, callExpr))
      .filter((sf): sf is SourceFile => sf !== null)
      .map(sf => relative(process.cwd(), sf.getFilePath()))

    const exports = sourceFile.getExportDeclarations()
      .filter(exportDecl => exportDecl.getModuleSpecifier())
      .map(exportDecl => exportDecl.getModuleSpecifierSourceFile())
      .filter((sf): sf is SourceFile => Boolean(sf))
      .map(sf => sf.getFilePath())
      .map(path => relative(process.cwd(), path))

    const allImports = [...imports, ...dynamicImports, ...exports]

    for (const importPath of allImports) {
      relations.push({ source: importPath, target: modulePath })
    }
  }

  return relations
}

function filesFromRelations(relations: { source: string, target: string }[]) {
  const files = new Set<string>()

  for (const relation of relations) {
    files.add(relation.source)
    files.add(relation.target)
  }

  return Array.from(files)
}

function relativePath(value: string) {
  return relative(process.cwd(), value)
}

function pathToNodeId(value: string) {
  return relativePath(value).replace(/[-/.@]/g, '_') || '.'
}

function nameToLabel(value: string) {
  return value
}

function getNodeDefinition(value: string, name?: string) {
  if (!value) throw new Error('Value is required')
  return `${pathToNodeId(value)}${name
    ? `[${nameToLabel(name)}]`
    : ''}`
}

// eslint-disable-next-line max-statements
export function getSourceCodeGraph() {
  const project = new Project({
    tsConfigFilePath: './tsconfig.json'
  })

  const sourceFiles = project.getSourceFiles()
  const relations = getRelations(project, sourceFiles).map(relation => ({
    source: relative(process.cwd(), relation.source),
    target: relative(process.cwd(), relation.target)
  }))
  const files = filesFromRelations(relations)
  const dirs = getDirs(files)

  function recursiveDirStructure(list: string[], dir: string): Item[] {
    const children = list.filter(item => item !== dir
      && item.split('/')
        .slice(0, -1)
        .join('/') === dir)

    const dirsList = children.map(child => {
      return {
        name: basename(child),
        path: child,
        type: 'dir',
        children: recursiveDirStructure(list, child)
      } satisfies Dir
    })
    const currentFiles = files
      .filter(file => {
        return file.split('/')
          .slice(0, -1)
          .join('/') === dir
      })
      .map(file => {
        return {
          name: basename(file),
          path: file,
          type: 'file'
        } satisfies File
      })

    return [
      ...dirsList,
      ...currentFiles
    ]
  }

  return {
    tree: recursiveDirStructure(dirs, ''),
    relations
  }
}

function itemsToMermaid(items: Item[]): string {
  let result = ''

  for (const item of items) {
    if (item.type === 'dir') {
      const color = dirBgColorPalette[item.path.split('/').length]

      result += `subgraph ${getNodeDefinition(item.path, item.name)}\n`
      result += `style ${pathToNodeId(item.path)} fill:${color}\n`
      result += itemsToMermaid(item.children)
      result += 'end\n'
    } else {
      result += `${getNodeDefinition(item.path, item.name)}\n`
    }
  }

  return result
}

export function toMermaid(tree: Item[], relations: Relation[]) {
  const graphDefinition = `
  flowchart TD

  ${itemsToMermaid(tree)}

  ${relations.map(relation => {
    return `${getNodeDefinition(relation.source)} --> ${getNodeDefinition(relation.target)}`
  }).join('\n')}
  `

  return graphDefinition
}
