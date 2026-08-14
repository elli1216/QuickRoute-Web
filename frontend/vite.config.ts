import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

export default defineConfig(({ command }) => ({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    // @cloudflare/vite-plugin causes "Error: write EOF" on Windows during dev mode (command === 'serve').
    // Enabling it only during build (command === 'build') ensures full Cloudflare production support.
    ...(command === 'build'
      ? [cloudflare({ viteEnvironment: { name: 'ssr' } })]
      : []),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
}))
