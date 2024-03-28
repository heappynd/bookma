// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  nitro: {
    storage: {
      db: {
        driver: "fs",
        base: "./.data/db",
      },
    },
  },
});
