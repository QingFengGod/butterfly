import { clone } from './common.util'
import { isObject } from './validator.util'
type Tree = Record<string, any> | Record<string, any>[]
type TreeToListOptions<T extends Record<string, any>> = {
  childrenKey?: keyof T
  keepChildren?: false
  clone?: boolean
}
/**
 * 将树转换为数组
 * @param { T | T[] } data 树数据
 * @param { TreeToListOptions } options 配置对象
 * @param { TreeToListOptions['clone'] } [options.clone =  false] 是否克隆树
 * @param { TreeToListOptions['childrenKey'] } [options.childrenKey = 'children'] 子节点键名
 * @param { TreeToListOptions['keepChildren'] } [options.keepChildren = false] 是否保留子节点
 * @returns { T[] } 数组
 */
export function treeToList<T extends Tree>(
  data: T,
  options: TreeToListOptions<T> = {}
): T extends Array<infer Item> ? Item[] : T[] {
  const { childrenKey = 'children', keepChildren = false, clone: isClone = false } = options
  let dataList: any = isClone ? clone(data) : data
  dataList = Array.isArray(dataList) ? dataList : [dataList]
  const result: any[] = []
  let i = 0
  while (i < dataList.length) {
    const item = dataList[i]
    result.push(item)
    const children = item[childrenKey]
    if (Array.isArray(children) && children.length > 0) {
      dataList = dataList.concat(children)
    }
    if (!keepChildren) {
      item[childrenKey] = undefined as any
    }
    i++
  }
  return result as T extends Array<infer Item> ? Item[] : T[]
}

type ListToTreeOptions<T extends Record<string, any>> = {
  childrenKey?: string
  primaryKey?: keyof T
  parentKey?: keyof T
  clone?: boolean
}
/**
 * 将列表转化为树节点
 * @param { ListToTreeOptions } options
 */
export function listToTree<T extends Record<string, any>>(data: T[], options?: ListToTreeOptions<T>) {
  const { childrenKey = 'children', primaryKey = 'id', parentKey = 'parentId', clone: isClone = false } = options || {}
  const tree: T[] = []
  let dataList = isClone ? clone(data) : data
  const map: { [key: string]: T } = {}
  for (let i = 0; i < dataList.length; i++) {
    const item = dataList[i]
    map[item[primaryKey]] = item
  }
  for (let i = 0; i < dataList.length; i++) {
    const item = dataList[i]
    const node = map[item[primaryKey]]
    const parent = item[parentKey]
    if (parent !== null && map[parent]) {
      if (map[parent][childrenKey]) {
        map[parent][childrenKey].push(node)
      } else {
        map[parent][childrenKey as keyof T] = [node] as any
      }
    } else {
      tree.push(node)
    }
  }
  return tree
}

// 深度优先遍历树
const depthEach = (data: any[], func: (item: any, level: number) => any, childrenKey: keyof any, level: number) => {
  for (let i = 0; i < data.length; i++) {
    const newItem = func(data[i], level)
    isObject(newItem) && Object.assign(data[i], newItem)
    if (data[i][childrenKey] && data[i][childrenKey].length > 0) {
      depthEach(data[i][childrenKey], func, childrenKey, level + 1)
    }
  }
}

// 广度优先遍历树
const breadthEach = (data: any[], func: (item: any, level: number) => any, childrenKey: keyof any, level: number) => {
  let childrenList: any[] = []
  let i = 0
  while (i < data.length) {
    const newItem = func(data[i], level)
    isObject(newItem) && Object.assign(data[i], newItem)
    if (data[i][childrenKey] && data[i][childrenKey].length > 0) {
      childrenList = childrenList.concat(data[i][childrenKey])
    }
    i++
  }
  if (childrenList.length > 0) {
    breadthEach(childrenList, func, childrenKey, level + 1)
  }
}

export type EachTreeOptions<T extends Tree> = {
  func: (item: T extends Array<infer Item> ? Item : T, level: number) => void // 遍历所执行的回调函数
  clone?: boolean
  childrenKey?: T extends Array<infer Item> ? keyof Item : keyof T
  eachMethod?: 'depth' | 'breadth'
}

/**
 * 遍历树
 * @param { T } data 树数据
 * @param { EachTreeOptions } options 配置对象
 * @param { EachTreeOptions['func'] } options.func 遍历所执行的回调函数
 * @param { EachTreeOptions['childrenKey'] } [options.childrenKey = 'children'] 子节点键名
 * @param { EachTreeOptions['eachMethod'] } [options.eachMethod = 'depth'] 遍历方式
 */
export function eachTree<T extends Tree>(data: T, options: EachTreeOptions<T>) {
  const { func, childrenKey = 'children', eachMethod = 'depth', clone: isClone = false } = options
  let dataList: any = isClone ? clone(data) : data
  dataList = Array.isArray(dataList) ? dataList : [dataList]
  // 深度优先
  if (eachMethod === 'depth') {
    depthEach(dataList, func as any, childrenKey, 1)
  } else {
    breadthEach(dataList, func as any, childrenKey, 1)
  }
}

export type MapTreeOptions<T extends Tree, O extends Record<string, any>> = {
  func: (item: T extends Array<infer Item> ? Item : T, level: number) => O // 遍历所执行的回调函数
  childrenKey?: T extends Array<infer Item> ? keyof Item : keyof T
  eachMethod?: 'depth' | 'breadth'
}

export type MapTreeReturn<T extends Tree, O extends Record<string, any> | void> = O extends void
  ? T
  : T extends Array<any>
    ? O[]
    : O

export function mapTree<T extends Tree, O extends Record<string, any>>(
  data: T,
  options: MapTreeOptions<T, O>
): MapTreeReturn<T, O> {
  const { func, childrenKey = 'children', eachMethod = 'depth' } = options
  let dataList: any = clone(data)
  dataList = Array.isArray(dataList) ? dataList : [dataList]
  // 深度优先
  if (eachMethod === 'depth') {
    depthEach(dataList, func as any, childrenKey, 1)
  } else {
    breadthEach(dataList, func as any, childrenKey, 1)
  }
  return Array.isArray(data) ? dataList : dataList[0]
}

export type FindTreeNodeOptions<T extends Tree> = {
  func: (item: T extends Array<infer Item> ? Item : T, level: number) => boolean | undefined // 遍历所执行的回调函数
  childrenKey?: T extends Array<infer Item> ? keyof Item : keyof T
  eachMethod?: 'depth' | 'breadth'
}

export function findTreeNode<T extends Tree>(
  data: T,
  options: FindTreeNodeOptions<T>
): (T extends Array<infer Item> ? Item : T) | undefined {
  const { func, childrenKey = 'children', eachMethod = 'depth' } = options
  const dataList = Array.isArray(data) ? data : [data]
  if (eachMethod === 'depth') {
    for (let i = 0; i < dataList.length; i++) {
      if (func(dataList[i], 1)) return dataList[i]
      if (dataList[i][childrenKey] && dataList[i][childrenKey].length > 0) {
        return findTreeNode(dataList[i][childrenKey], { func, childrenKey, eachMethod } as any)
      }
    }
  } else {
    let childs: any = []
    for (let i = 0; i < dataList.length; i++) {
      if (func(dataList[i], 1)) return dataList[i]
      if (dataList[i][childrenKey] && dataList[i][childrenKey].length > 0) {
        childs = childs.concat(dataList[i][childrenKey])
      }
    }
    if (childs.length > 0) {
      return findTreeNode(childs, { func, childrenKey, eachMethod } as any)
    }
  }
}

export type FilterTreeOptions<T extends Tree> = {
  func: (item: T extends Array<infer Item> ? Item : T, level: number) => boolean | undefined // 遍历所执行的回调函数
  childrenKey?: T extends Array<infer Item> ? keyof Item : keyof T
  clone?: boolean
}
export function filterTree<T extends Tree>(
  data: T,
  options: FilterTreeOptions<T>
): T extends Array<infer Item> ? Item[] : T {
  const { func, childrenKey = 'children', clone: isClone = false } = options as any
  let dataList: any = isClone ? clone(data) : data
  dataList = Array.isArray(dataList) ? dataList : [dataList]
  const _filter = (data: any, level: number) => {
    return data.filter((item: any) => {
      if (item[childrenKey] && item[childrenKey].length > 0) {
        item[childrenKey] = _filter(item[childrenKey], level + 1)
      }

      if (func(item, level)) return true
      return false
    })
  }
  return _filter(dataList, 1)
}
