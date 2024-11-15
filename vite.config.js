import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        rollUpOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                demographic: 'demographic.html',
            }
        }
    }
})
