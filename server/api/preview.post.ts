import axios from "axios";
import * as cheerio from "cheerio";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  console.log("body", body.url);

  const response = await axios.get(body.url);
  const html = response.data;

  console.log('response', response)

  // 使用cheerio加载HTML内容
  const $ = cheerio.load(html);

  // 提取标题和描述
  const title = $("head>title").text();
  const description = $('meta[name="description"]').attr("content");

  // console.log("title", title);
  // console.log("description", description);

  return {
    title,
    description,
  };
});
