declare module '@vue/runtime-core' {
  interface GlobalComponents {
    BfFlex: typeof import('@/components').BfFlex
    BfGrid: typeof import('@/components').BfGrid
    BfGridItem: typeof import('@/components').BfGridItem
    BfIcon: typeof import('@/components').BfIcon
    BfCollapseAside: typeof import('@/components').BfCollapseAside
    ExButton: typeof import('@/components').ExButton
    BfPermission: typeof import('@/components').BfPermission
  }

  interface GlobalDirectives {
    vResize: import('@/common/directives').ResizeDirective
    vTransition: import('@/common/directives').TransitionDirective
    vAnimate: import('@/common/directives').AnimateDirective
    vShine: import('@/common/directives').ShineDirective
  }
}

export {}
