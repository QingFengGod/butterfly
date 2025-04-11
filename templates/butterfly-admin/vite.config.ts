import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join } from 'node:path'
import Unocss from 'unocss/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, join(process.cwd(), 'env'), 'BF')
  return {
    envDir: join(process.cwd(), 'env'),
    envPrefix: 'BF',
    plugins: [
      vue(),
      Unocss(),
      createSvgIconsPlugin({
        iconDirs: [join(process.cwd(), 'src/assets/svg')],
        symbolId: 'svg-[dir]-[name]'
      })
    ],
    resolve: {
      alias: {
        '@': join(process.cwd(), 'src')
      }
    },
    server: {
      host: '0.0.0.0',
      proxy: {
        [env.BF_PROXY_URL]: {
          target: env.BF_API_BASEURL,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${env.BF_PROXY_URL}`), '')
        }
      }
    }
  }
})
