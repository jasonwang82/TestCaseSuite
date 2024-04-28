import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: {
            '/api/lottery/sendres': 'http://localhost:8001',
            '/api/lottery/get-name-list': 'http://localhost:8001',
            '/api/lottery/save-name-list': 'http://localhost:8001',
        }
    }
})
