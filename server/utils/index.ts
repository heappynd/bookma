import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeWebsite(url: string) {
  try {
    const response = await axios.get(url);

    const $ = cheerio.load(response.data);

    const title = $("title").eq(0).text();
    // 获取页面中的favicon链接
    const a = $('link[rel="icon"]').eq(0).attr("href");
    const b = $('link[rel="shortcut icon"]').eq(0).attr("href");
    let icon = "";

    if (a) {
      icon = a;
    }
    if (b) {
      icon = b;
    }

    if (
      icon !== "" &&
      !icon.startsWith("http") &&
      !icon.startsWith("https") &&
      !icon.startsWith("//")
    ) {
      icon = new URL(url).origin + icon;
    }

    return { title, icon };
  } catch (error) {
    throw error
  }
}

// 调用函数来爬取网页
// const targetUrl = "https://github.com/yiminghe/async-validator";
// const targetUrl = "https://procomponents.ant.design/";
// const targetUrl = "https://rollupjs.org/";
// scrapeWebsite(targetUrl)
//   .then((res) => {
//     console.log("提取的链接:", res);
//   })
//   .catch((error) => {
//     console.error("爬取网页时发生错误:", error);
//   });
