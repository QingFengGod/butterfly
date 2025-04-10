import { expect, test, describe } from 'bun:test'
import { createSafeObjGetterSetter, objOmit, objPick } from '../src'
describe('obj.util', () => {
  test('createSafeObjGetterSetter', () => {
    type UserInfo = {
      name?: string
      age?: number
      gender?: '男' | '女'
      role?: {
        name?: string
        permissions?: Array<{
          name?: string
          description?: string
          code?: Array<{
            codeKey: string
            codeValue: string
            data?: [
              {
                name: string
                value: string
              }
            ]
          }>
        }>
      }
    }
    const obj: UserInfo = {
      name: '张三',
      age: 15,
      role: {
        name: '管理员',
        permissions: [
          {
            name: '读取',
            description: '读取数据',
            code: []
          }
        ]
      }
    }

    const [userGet, userSet] = createSafeObjGetterSetter(obj)
    expect(userGet('age')).toBe(15)
    expect(userGet('gender', '男')).toBe('男')
    expect(userGet('name', '默认值')).toBe('张三')
    expect(userGet('role.name')).toBe('管理员')
    expect(userGet('role.permissions.0.name')).toBe('读取')
    expect(userGet('role.permissions.1.code.1.data.0', { name: '默认值', value: '默认值' })).toEqual({
      name: '默认值',
      value: '默认值'
    })
    expect<any>(userGet('role.permissions.1.code.1.data.0')).toEqual(undefined)
    expect<any>(obj).toEqual({
      name: '张三',
      age: 15,
      role: { name: '管理员', permissions: [{ name: '读取', description: '读取数据', code: [] }] }
    })

    userSet('age', 16)
    expect(userGet('age')).toBe(16)

    userSet('role.permissions.0.name', '修改')
    expect(userGet('role.permissions.0.name')).toBe('修改')

    userSet('role.permissions.0.code.0.data.0.name', '李四')
    expect<any>(userGet('role.permissions.0.code.0.data.0.name')).toBe(undefined)

    const [userGet2] = createSafeObjGetterSetter({
      a: {
        b: {
          c: 1,
          d: [{ e: 1 }]
        }
      }
    })
    expect(userGet2('a.b.d.0.e')).toBe(1)
    expect(userGet2('a.b.c')).toBe(1)
  })

  test('objOmit', () => {
    const symbol1 = Symbol('symbol')
    const obj = { a: 1, b: 2, c: 3, d: 4, 1: 1, e: 5, [symbol1]: 6 }
    const result = objOmit(obj, 'a', 'b')
    expect(result).toEqual({ c: 3, d: 4, e: 5, [symbol1]: 6, 1: 1 })
  })

  test('objPick', () => {
    const symbol1 = Symbol('symbol')
    const obj = { a: 1, b: 2, c: 3, d: 4, 1: 1, e: 5, [symbol1]: 6 }
    const result = objPick(obj, 'a', 'b')
    expect(result).toEqual({ a: 1, b: 2 })
  })
})
