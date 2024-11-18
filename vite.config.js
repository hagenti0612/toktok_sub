import { defineConfig } from 'vite'
import fs from 'fs';
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 모든 네트워크 인터페이스에서 접근 가능
    //port: 3000,      // 사용할 포트
    cors: true,      // CORS 허용
    //https: {
    //  key: fs.readFileSync("C:\\work\\mkcert\\192.168.0.123-key.pem"),
    //  cert: fs.readFileSync("C:\\work\\mkcert\\192.168.0.123.pem"),
    //},

  }
})
