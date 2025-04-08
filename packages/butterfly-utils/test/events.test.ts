import { test, describe } from 'bun:test'
import { createEventBus, createEventStore } from '../src'

describe('events.util', () => {
  test('createEventStore', () => {
    const eventStore = createEventStore<[age: number, name: string]>()
    eventStore.on('fn1', (age, name) => {
      console.log('fn1', age, name)
    })
    eventStore.on('fn2', (age, name) => {
      console.log('fn2', age, name)
    })
    eventStore.trigger('fn1', [1, 'test1'])
    eventStore.trigger('fn2', [1, 'test1'])
    eventStore.trigger([1, 'test1'])
    eventStore.off('fn1')
    console.log('---- off fn1 ----')
    eventStore.trigger('fn1', [1, 'test1'])
    eventStore.trigger('fn2', [1, 'test1'])
    eventStore.trigger([1, 'test1'])
    eventStore.once('fn3', (age, name) => {
      console.log('fn3', age, name)
    })
    console.log('---- once fn3 ----')
    eventStore.trigger('fn3', [1, 'test1'])
    eventStore.trigger('fn3', [2, 'test2'])
  })

  test('createEventBus', () => {
    const eventBus = createEventBus<'fn1' | 'fn2' | 'fn3'>()
    eventBus.on('fn1', (age, name) => {
      console.log('fn1', age, name)
    })
    eventBus.on('fn2', (s: string) => {
      console.log('fn2', s)
    })
    eventBus.trigger('fn1', [1, 'test1'])
    eventBus.trigger('fn2', ['test2'])
    eventBus.trigger(['test3'])
    eventBus.off('fn1')
    console.log('---- off fn1 ----')
    eventBus.trigger('fn1', [1, 'test1'])
    eventBus.trigger('fn2', ['test2'])
    eventBus.trigger(['test3'])
    eventBus.once('fn3', (age, name) => {
      console.log('fn3', age, name)
    })
    console.log('---- once fn3 ----')
    eventBus.trigger('fn3', [1, 'test1'])
    eventBus.trigger('fn3', [2, 'test2'])
  })
})
