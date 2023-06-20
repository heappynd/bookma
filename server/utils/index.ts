import axios from 'axios'
import * as cheerio from 'cheerio'

type WebsiteTitle = {
  title: string
}

export function getWebsiteTitle(url: string) {
  return new Promise<WebsiteTitle>((resolve, reject) => {
    axios
      .get(url)
      .then((response) => {
        const $ = cheerio.load(response.data)
        const title = $('title').first().text()
        if (!title) console.log('未获取', url)
        resolve({ title: title || url })
      })
      .catch(() => {
        resolve({ title: url })
      })
  })
}
