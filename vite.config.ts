import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ],
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === 'charset') {
                atRule.remove()
              }
            }
          }
        }
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  base: './',
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  // 打包配置
  build: {
    target: 'modules',
    outDir: 'dist', // 指定输出路径
    assetsDir: 'assets', // 指定生成静态资源的存放路径
    cssCodeSplit: false /* 整个项目中的所有 CSS 将被提取到一个 CSS 文件中 */,
    minify: 'terser', // 混淆器，terser构建后文件体积更小
    chunkSizeWarningLimit: 150 /* chunk 大小警告的限制（以 kbs 为单位） */,
    sourcemap: true /* 构建后是否生成 source map 文件 */,
    manifest: true /*  */,
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js1/[name].[hash].js',
        entryFileNames: 'static/js2/[name].[hash].js',
        assetFileNames: 'static/[ext]/[name].[hash].[ext]'
      }
    }
  }
})
