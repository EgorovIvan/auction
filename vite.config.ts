import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore
import eslint from "vite-plugin-eslint";

export default defineConfig({
  plugins: [react(), eslint({
    fix: true, // Автоматическое исправление ошибок, если возможно
  }),],
})
