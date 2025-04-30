import { defineStore } from 'pinia'

export interface MenuItem {
  name: string
  path: string
  icon: string
  children?: MenuItem[]
}

export interface MenuStore {
  menuList: MenuItem[]
}

export const useMenuStore = defineStore('menu', {
  state: () => {
    return {
      menuList: []
    } as MenuStore
  },
  actions: {
    loadMenus() {}
  }
})
