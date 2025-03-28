import { test, describe } from 'bun:test'
import { randomColor, randomItem, randomNumber, randomString } from '../src'

describe('random.util', () => {
  test('randomNumber [1, 10) 整数', () => {
    const result: number[] = []
    for (let i = 0; i < 20; i++) {
      result.push(randomNumber({ min: 1, max: 10 }))
    }
    console.log(result.join(', '))
  })
  test('randomNumber [1, 10) 小数两位', () => {
    const result: number[] = []
    for (let i = 0; i < 20; i++) {
      result.push(randomNumber({ min: 0, max: 10, decimals: 2 }))
    }
    console.log(result.join(', '))
  })

  test('randomNumber [-10, 10) 小数位数5', () => {
    const result: number[] = []
    for (let i = 0; i < 20; i++) {
      result.push(randomNumber({ min: -10, max: 10, isFloat: true, decimals: 5 }))
    }
    console.log(result.join(', '))
  })

  test('randomString', () => {
    const result: string[] = []
    for (let i = 0; i < 20; i++) {
      result.push(randomString())
    }
    console.log(result.join(', '))
  })

  test('randomColor', () => {
    console.log(randomColor())
    console.log(randomColor({ alpha: true }))
    console.log(randomColor({ type: 'rgb' }))
    console.log(randomColor({ type: 'rgb', alpha: true }))
    console.log(randomColor(['#000000', '#ffffff']))
  })

  test('randomItem', () => {
    console.log(randomItem('1234567890'))
    console.log(randomItem(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']))
    console.log(
      randomItem(
        new Map([
          ['a', '1'],
          ['b', '2'],
          ['c', '3']
        ])
      )
    )
    console.log(randomItem(new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'])))
  })
})
