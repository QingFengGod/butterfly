/**
 * 断言
 * @param { any } condition
 * @param { string } [message] 错误信息
 * @returns { void }
 */
export function assert(condition: boolean, msg: string): asserts condition {
  if (!condition) {
    throw new Error(`Assertion Error: ${msg}`)
  }
}

/**
 * 断言是否是字符串
 * @param { any } val
 * @param { string } [variableName] 变量名
 * @returns { void }
 */
export function assertString(val: any, variableName: string): asserts val is string {
  assert(typeof val === 'string', `Expected ${variableName} string but received a ${typeof val}`)
}

/**
 * 断言是否是数字
 * @param { any } val
 * @param { string } [variableName] 变量名
 * @returns { void }
 */
export function assertNumber(val: any, variableName: string): asserts val is number {
  assert(typeof val === 'number', `Expected ${variableName} number but received a ${typeof val}`)
}

/**
 * 断言是否是布尔值
 * @param { any } val
 * @param { string } [variableName] 变量名
 * @returns { void }
 */
export function assertBoolean(val: any, variableName: string): asserts val is boolean {
  assert(typeof val === 'boolean', `Expected ${variableName} boolean but received a ${typeof val}`)
}

/**
 * 断言是否是函数
 * @param { any } val
 * @param { string } [variableName] 变量名
 * @returns { void }
 */
export function assertFunction(val: any, variableName: string): asserts val is Function {
  assert(typeof val === 'function', `Expected ${variableName} function but received a ${typeof val}`)
}
