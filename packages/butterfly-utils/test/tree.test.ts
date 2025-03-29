import { test, describe, expect } from 'bun:test'
import { eachTree, listToTree, treeToList } from '../src'

describe('tree.util', () => {
  type TreeNode = {
    id: string
    name: string
    children?: TreeNode[]
    parentId?: string
  }
  const getNodes = (count: number, parentId?: string) => {
    const nodes: TreeNode[] = []
    for (let i = 0; i < count; i++) {
      nodes.push({ id: parentId ? `${parentId}-${i}` : String(i), name: `node-${i}`, parentId })
    }
    return nodes
  }

  const generateTree = (depth: number, count: number, parentId?: string) => {
    if (depth <= 0 || count <= 0) return []
    const nodes = getNodes(count, parentId)
    if (depth > 0) {
      nodes.forEach((node) => {
        const children = generateTree(depth - 1, count, node.id)
        if (children.length > 0) {
          node.children = children
        } else {
          node.children = undefined
        }
      })
    }
    return nodes
  }

  const getTotalNodeCount = (depth: number, count: number) => {
    if (depth <= 0 || count <= 0) return 0
    if (count === 1) return depth
    return (count * (Math.pow(count, depth) - 1)) / (count - 1)
  }

  // test(`treeToList 节点数量${getTotalNodeCount(5, 5)} clone`, () => {
  //   const data: TreeNode[] = generateTree(5, 5)
  //   const start = performance.now()
  //   const result = treeToList(data, { clone: true })
  //   const end = performance.now()
  //   console.log(`耗时: ${end - start}ms`)
  //   expect(result.length).toEqual(getTotalNodeCount(5, 5))
  // })

  // test(`treeToList 节点数量${getTotalNodeCount(5, 5)} 不clone`, () => {
  //   const data: TreeNode[] = generateTree(5, 5)
  //   const start = performance.now()
  //   const result = treeToList(data)
  //   const end = performance.now()
  //   console.log(`耗时: ${end - start}ms`)
  //   expect(result.length).toEqual(getTotalNodeCount(5, 5))
  // })

  // test(`listToTree 节点数量${getTotalNodeCount(5, 5)} clone`, () => {
  //   const data: TreeNode[] = generateTree(5, 5)
  //   const list = treeToList(data, { clone: true })
  //   const start = performance.now()
  //   const result = listToTree(list, { clone: true })
  //   const end = performance.now()
  //   console.log(`耗时: ${end - start}ms`)
  //   expect(result).toEqual(data)
  // })

  // test(`listToTree 节点数量${getTotalNodeCount(5, 5)} 不clone`, () => {
  //   const data: TreeNode[] = generateTree(5, 5)
  //   const list = treeToList(data, { clone: true })
  //   const start = performance.now()
  //   const result = listToTree(list)
  //   const end = performance.now()
  //   console.log(`耗时: ${end - start}ms`)
  //   expect(result).toEqual(data)
  // })

  test(`eachTree 节点数量${getTotalNodeCount(3, 3)} 深度优先`, () => {
    const data: TreeNode[] = generateTree(3, 3)
    const result: string[] = []
    const start = performance.now()
    eachTree(data, {
      func: (item) => {
        result.push(item.id)
      },
      eachType: 'depth'
    })
    const end = performance.now()
    console.log(`耗时: ${end - start}ms`)
    expect(result).toEqual([
      '0',
      '0-0',
      '0-0-0',
      '0-0-1',
      '0-0-2',
      '0-1',
      '0-1-0',
      '0-1-1',
      '0-1-2',
      '0-2',
      '0-2-0',
      '0-2-1',
      '0-2-2',
      '1',
      '1-0',
      '1-0-0',
      '1-0-1',
      '1-0-2',
      '1-1',
      '1-1-0',
      '1-1-1',
      '1-1-2',
      '1-2',
      '1-2-0',
      '1-2-1',
      '1-2-2',
      '2',
      '2-0',
      '2-0-0',
      '2-0-1',
      '2-0-2',
      '2-1',
      '2-1-0',
      '2-1-1',
      '2-1-2',
      '2-2',
      '2-2-0',
      '2-2-1',
      '2-2-2'
    ])
  })

  test(`eachTree 节点数量${getTotalNodeCount(3, 3)} 广度优先`, () => {
    const data: TreeNode[] = generateTree(3, 3)
    const result: string[] = []
    const start = performance.now()
    eachTree(data, {
      func: (item) => {
        result.push(item.id)
      },
      eachType: 'breadth'
    })
    const end = performance.now()
    console.log(`耗时: ${end - start}ms`)

    expect(result).toEqual([
      '0',
      '1',
      '2',
      '0-0',
      '0-1',
      '0-2',
      '1-0',
      '1-1',
      '1-2',
      '2-0',
      '2-1',
      '2-2',
      '0-0-0',
      '0-0-1',
      '0-0-2',
      '0-1-0',
      '0-1-1',
      '0-1-2',
      '0-2-0',
      '0-2-1',
      '0-2-2',
      '1-0-0',
      '1-0-1',
      '1-0-2',
      '1-1-0',
      '1-1-1',
      '1-1-2',
      '1-2-0',
      '1-2-1',
      '1-2-2',
      '2-0-0',
      '2-0-1',
      '2-0-2',
      '2-1-0',
      '2-1-1',
      '2-1-2',
      '2-2-0',
      '2-2-1',
      '2-2-2'
    ])
  })
})
