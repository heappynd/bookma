import axios from 'axios'
import * as cheerio from 'cheerio'

type WebsiteTitle = {
  title: string
  icon: string | null
}

export function getWebsiteTitle(url: string) {
  return new Promise<WebsiteTitle>((resolve, reject) => {
    axios
      .get(url)
      .then((response) => {
        const $ = cheerio.load(response.data)
        const title = $('title').first().text()
        if (!title) console.log('未获取', url)
        const href = $("link[rel=icon]").attr('href')
        const base = new URL(url).origin
        const iconUrl = href ? new URL(href, base).href : null
        console.log('iconUrl', iconUrl)
        resolve({ title: title || url, icon: iconUrl })
      })
      .catch(() => {
        resolve({ title: url, icon: null })
      })
  })
}