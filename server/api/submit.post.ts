import axios from "axios";
import * as cheerio from "cheerio";
import { nanoid } from "nanoid";
import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const storage = useStorage("db");

  const originList = await storage.getItem<any[]>("list");

  await useStorage("db").setItem("list", [
    {
      id: nanoid(),
      ...body,
      createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    },
    ...(originList ?? []),
  ]);

  console.log("body", body);

  return "ok";
});
