import type { Fn } from './util.type'
import { assert } from './common.util'
import { isFunction, isString } from './validator.util'

class EventStore<OnFn extends Fn = Fn, FnName extends string = string> {
  private fns = new Map<FnName, Set<OnFn>>()

  on(fnName: FnName, callback: OnFn) {
    assert(isString(fnName), 'fnName must be a string')
    assert(isFunction(callback), 'callback must be a function')
    const callbacks = this.fns.get(fnName) || new Set<OnFn>()
    callbacks.add(callback)
    this.fns.set(fnName, callbacks)
  }

  once(fnName: FnName, callback: OnFn) {
    assert(isString(fnName), 'fnName must be a string')
    assert(isFunction(callback), 'callback must be a function')
    const callbacks = this.fns.get(fnName) || new Set<OnFn>()

    const onceCallback = (...args: Parameters<OnFn>) => {
      callback(...args)
      this.off(fnName, onceCallback as OnFn)
    }
    callbacks.add(onceCallback as OnFn)
    this.fns.set(fnName, callbacks)
  }

  off(fnName: FnName, callback?: OnFn) {
    assert(isString(fnName), 'fnName must be a string')
    const callbacks = this.fns.get(fnName)
    if (callbacks) {
      if (callback) {
        callbacks.delete(callback)
      } else {
        callbacks.clear()
      }
    }
  }

  clear() {
    this.fns.clear()
  }

  trigger(fnName: FnName, args: Parameters<OnFn>): void
  trigger(args: Parameters<OnFn>): void
  trigger(fnName: FnName | Parameters<OnFn>, args?: Parameters<OnFn>) {
    if (fnName && Array.isArray(fnName)) {
      this.fns.forEach((callbacks) => callbacks.forEach((callback) => callback(...fnName)))
    }
    if (isString(fnName) && Array.isArray(args)) {
      const callbacks = this.fns.get(fnName)
      if (callbacks) {
        callbacks.forEach((callback) => callback(...args))
      }
    }
  }
}

/**
 * 创建一个事件存储器
 * @returns 事件存储器
 */
export function createEventStore<Args extends any[]>() {
  const store = new EventStore<(...args: Args) => void>()
  return store
}

/**
 * 创建一个事件总线
 * @returns 事件总线
 */
export function createEventBus<EventNames extends string>() {
  return new EventStore<(...args: any[]) => void, EventNames>()
}
