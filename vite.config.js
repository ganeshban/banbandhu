
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/banbandhu/",
  server: {
    allowedHosts: [".ganeshban.com.np"]
  },
  plugins: [react()],
});
