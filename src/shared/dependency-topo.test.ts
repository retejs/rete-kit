import { describe, expect, it } from '@jest/globals'

import { getDependencyTopo, PackageFile, PackageMeta } from './dependency-topo'

describe('Dependency topology', () => {
  it('basic', () => {
    const a: PackageFile = { name: 'a' }
    const b: PackageFile = { name: 'b', dependencies: { a: '', c: '' } }
    const c: PackageFile = { name: 'c', dependencies: { a: '' } }

    const packages: PackageMeta[] = [
      {
        folder: './pkgs/a',
        config: a
      },
      {
        folder: './pkgs/b',
        config: b
      },
      {
        folder: './c',
        config: c
      }
    ]
    const dirs = getDependencyTopo(packages)

    expect(dirs).toEqual([
      {
        dependencies: [],
        dependent: ['b', 'c'],
        folder: './pkgs/a',
        config: a
      },
      {
        dependencies: ['a'],
        dependent: ['b'],
        folder: './c',
        config: c
      },
      {
        dependencies: ['a', 'c'],
        dependent: [],
        folder: './pkgs/b',
        config: b
      }
    ])
  })

  it('no dependent', () => {
    const packages: PackageMeta[] = [
      {
        folder: './pkgs/a',
        config: { name: 'a' }
      },
      {
        folder: './pkgs/b',
        config: { name: 'b' }
      }
    ]
    const dirs = getDependencyTopo(packages)

    expect(dirs).toEqual([])
  })

  it('includes devDependencies in topology', () => {
    const a: PackageFile = { name: 'a' }
    const b: PackageFile = { name: 'b', devDependencies: { a: '' } }
    const c: PackageFile = { name: 'c', dependencies: { a: '' }, devDependencies: { b: '' } }

    const packages: PackageMeta[] = [
      {
        folder: './pkgs/a',
        config: a
      },
      {
        folder: './pkgs/b',
        config: b
      },
      {
        folder: './pkgs/c',
        config: c
      }
    ]
    const dirs = getDependencyTopo(packages)

    expect(dirs).toEqual([
      {
        dependencies: [],
        dependent: ['b', 'c'],
        folder: './pkgs/a',
        config: a
      },
      {
        dependencies: ['a'],
        dependent: ['c'],
        folder: './pkgs/b',
        config: b
      },
      {
        dependencies: ['a', 'b'],
        dependent: [],
        folder: './pkgs/c',
        config: c
      }
    ])
  })
})
