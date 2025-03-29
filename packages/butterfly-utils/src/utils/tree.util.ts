import { clone } from './common.util'

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
export function treeToList<T extends Record<string, any>>(
  data: T | T[],
  options: TreeToListOptions<T> = {}
): T[] {
  const { childrenKey = 'children', keepChildren = false, clone: isClone = false } = options
  let dataList = isClone ? clone(data) : data
  dataList = Array.isArray(dataList) ? dataList : [dataList]
  const result: T[] = []
  let i = 0
  while (i < dataList.length) {
    const item = dataList[i]
    result.push(item)
    const children = item[childrenKey]
    if (Array.isArray(children) && children.length > 0) {
      for (let j = 0; j < children.length; j++) {
        dataList.push(children[j])
      }
    }
    if (!keepChildren) {
      item[childrenKey] = undefined as any
    }
    i++
  }
  return result
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
  const {
    childrenKey = 'children',
    primaryKey = 'id',
    parentKey = 'parentId',
    clone: isClone = false
  } = options || {}
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
const depthEach = (
  data: any[],
  func: (item: any, level: number) => void,
  childrenKey: keyof any,
  level: number
) => {
  for (let i = 0; i < data.length; i++) {
    func(data[i], level)
    const item = data[i]
    if (item[childrenKey] && item[childrenKey].length > 0) {
      depthEach(item[childrenKey], func, childrenKey, level + 1)
    }
  }
}

// 广度优先遍历树
const breadthEach = (
  data: any[],
  func: (item: any, level: number) => void,
  childrenKey: keyof any,
  level: number
) => {
  let eachList: any[] = data,
    nextWaitList: any[] = [],
    nextLevel = level
  let i = 0
  while (eachList.length > 0) {
    const item = eachList[i]
    func(item, nextLevel)
    if (item[childrenKey] && item[childrenKey].length > 0) {
      nextWaitList.push(...item[childrenKey])
    }
    if (i + 1 === eachList.length) {
      if (nextWaitList.length == 0) break
      eachList = nextWaitList
      nextWaitList = []
      nextLevel++
      i = -1
    }
    i++
  }
}

export type EachTreeOptions<T extends Record<string, any>> = {
  func: (item: T, level: number) => void // 遍历所执行的回调函数
  childrenKey?: keyof T
  eachMethod?: 'depth' | 'breadth'
}
/**
 * 遍历树
 * @param { T[] | T } data 树数据
 * @param { EachTreeOptions } options 配置对象
 * @param { EachTreeOptions['func'] } options.func 遍历所执行的回调函数
 * @param { EachTreeOptions['childrenKey'] } [options.childrenKey = 'children'] 子节点键名
 * @param { EachTreeOptions['eachMethod'] } [options.eachMethod = 'depth'] 遍历方式
 */
export function eachTree<T extends Record<string, any>>(data: T[] | T, options?: EachTreeOptions<T>): void {
  const { func, childrenKey = 'children', eachMethod = 'depth' } = options as EachTreeOptions<T>
  const dataList = Array.isArray(data) ? data : [data]
  // 深度优先
  if (eachMethod === 'depth') {
    depthEach(dataList, func, childrenKey, 1)
  } else {
    breadthEach(dataList, func, childrenKey, 1)
  }
}

// export type MapTreeOptions<T extends { [key: string]: any }, O = any> = TreeOptions<T> & {
//   func: (item: T, level: number) => O // 遍历所执行的回调函数
//   depthFirst?: boolean // 深度优先还是广度优先遍历
// }
// export function mapTree<T extends { [key: string]: any }, O = any>(options: MapTreeOptions<T, O>): O {
//   const { data, func, childrenKey = 'children', level = 1, depthFirst = true } = options as MapTreeOptions<T, O> & { level: number }
//   if(Array.isArray(data)) {
//     // 深度优先
//     if(depthFirst) {
//       for (let i = 0; i < data.length; i++) {
//         data[i] = func(data[i], level) as any
//         if(data[i][childrenKey!] && data[i][childrenKey].length > 0) {
//           mapTree({ data: data[i][childrenKey], func, childrenKey, level: level + 1, depthFirst } as any)
//         }
//       }
//       return
//     }
//     // 广度优先
//     let eachList: any[] = data, nextWaitList: any[] = [], nextLevel = level
//     let i = 0
//     while (eachList.length > 0) {
//       func(eachList[i], nextLevel)
//       if(eachList[i][childrenKey] && eachList[i][childrenKey].length > 0) {
//         nextWaitList.push(...eachList[i][childrenKey])
//       }
//       if(i === eachList.length - 1) {
//         if(nextWaitList.length == 0) break
//         eachList = nextWaitList
//         nextWaitList = []
//         nextLevel++
//         i = -1
//       }
//       i++
//     }
//   } else {
//     func(data, level)
//     if(data[childrenKey] && data[childrenKey].length > 0) {
//       mapTree({ func, childrenKey, data: data[childrenKey], level: level + 1, depthFirst } as any)
//     }
//   }
//   return data
// }

export type FinTreeNodeOptions<T extends { [key: string]: any }> = TreeOptions<T> & {
  func: (item: T, level: number) => boolean | undefined // 遍历所执行的回调函数
  depthFirst?: boolean // 深度优先还是广度优先遍历
}

/**
 * 树节点查找
 * @param { FinTreeNodeOptions } options
 * @returns { T | undefined } 查找到的节点
 */
export function findTreeNode<T extends { [key: string]: any }>(
  options: FinTreeNodeOptions<T>
): T | undefined {
  const {
    data,
    func,
    childrenKey = 'children',
    level = 1,
    depthFirst = true
  } = options as FinTreeNodeOptions<T> & { level: number }
  if (Array.isArray(data)) {
    // 深度优先
    if (depthFirst) {
      for (let i = 0; i < data.length; i++) {
        if (func(data[i], level)) return data[i]
        if (data[i][childrenKey!] && data[i][childrenKey].length > 0) {
          let find = findTreeNode({
            data: data[i][childrenKey],
            func,
            childrenKey,
            level: level + 1,
            depthFirst
          } as any)
          if (find) return find as T
        }
      }
      return
    }
    // 广度优先
    let eachList: any[] = data,
      nextWaitList: any[] = [],
      nextLevel = level
    let i = 0
    while (eachList.length > 0) {
      if (func(eachList[i], nextLevel)) return eachList[i]
      if (eachList[i][childrenKey] && eachList[i][childrenKey].length > 0) {
        nextWaitList.push(...eachList[i][childrenKey])
      }
      if (i === eachList.length - 1) {
        if (nextWaitList.length == 0) return
        eachList = nextWaitList
        nextWaitList = []
        nextLevel++
        i = -1
      }
      i++
    }
  } else {
    if (func(data, level)) return data
    if (data[childrenKey] && data[childrenKey].length > 0) {
      return findTreeNode({ func, childrenKey, data: data[childrenKey], level: level + 1, depthFirst } as any)
    }
  }
}

type FilterTreeOptions<T extends { [key: string]: any }> = TreeOptions<T> & {
  func: (item: T, level: number) => boolean
  childrenKey?: keyof T
}
export function filterTree<T extends { [key: string]: any }>(options: FilterTreeOptions<T>): T[] {
  const { data, childrenKey = 'children', level = 1, func } = options as any
  if (Array.isArray(data)) {
    return data.filter((item) => {
      if (item[childrenKey] && item[childrenKey].length > 0) {
        let children = filterTree({ data: item[childrenKey], childrenKey, level: level + 1, func } as any)
        item = { ...item, [childrenKey]: children }
        if (children.length == 0) {
          delete item[childrenKey]
        }
      }
      if (func(item, level)) {
        return true
      }
      return false
    })
  } else {
    return filterTree({ data: [data], childrenKey, level: 1, func } as any)
  }
}
