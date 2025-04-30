import type { App, Directive } from 'vue'
import { createTransitionDirective } from './transition'
import { createResizeDirective } from './resize'
import { createAnimateDirective } from './animate'
import { createShineDirective } from './shine'
export * from './resize'
export * from './transition'
export * from './animate'
export * from './shine'

export const butterflyDirectives = (
  directives: Array<{
    directiveName: string
    directive: Directive
  }> = [createTransitionDirective(), createResizeDirective(), createAnimateDirective(), createShineDirective()]
) => {
  return {
    install: (app: App) => {
      directives.forEach((item) => {
        app.directive(item.directiveName, item.directive)
      })
    }
  }
}
