import express from "express";
import db from "../db.js";
import { scrapeWebsite } from "../utils/index.js";
import { v4 as uuidv4 } from "uuid";
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log("Time: ", Date.now(), req.baseUrl + req.url);
  next();
});
// define the home page route
router.get("/", async (req, res) => {
  const { dir_id } = req.query;
  await db.read();
  const marks = db.data.marks;
  if (dir_id) {
    res.json({
      code: 200,
      data: marks.filter((item) => item.dir_id === dir_id),
    });
  } else {
    res.json({
      code: 200,
      data: marks,
    });
  }
});
// define the about route
router.post("/", async (req, res) => {
  const href = req.body.href;
  const dir_id = req.body.dir_id;
  await db.read();
  const marks = db.data.marks;
  // console.log(marks);
  const { icon, title } = await scrapeWebsite(href);
  console.log("marks.length", marks.length);
  const mark = {
    id: marks.length + 1,
    href,
    add_date: Date.now(),
    icon,
    text: title ? title : href,
    dir_id,
  };
  marks.push(mark);
  await db.write();
  res.json({
    code: 200,
    data: mark,
  });
});

router.delete("/:id", async (req, res) => {
  await db.read();
  const marks = db.data.marks;
  const idx = marks.findIndex((item) => item.id == req.params.id);
  console.log(idx);
  marks.splice(idx, 1);
  await db.write();
  res.json({
    code: 200,
    data: null,
  });
});

router.get("/refresh", async (req, res) => {
  await db.read();
  /**
   * @type { any[] }
   */
  const marks = db.data.marks;
  let promises = marks.map((item) => {
    return new Promise((resolve, reject) => {
      scrapeWebsite(item.href)
        .then((res) => {
          console.log("res", res);
          item.id = uuidv4();
          item.text = res.title;
          item.icon = res.icon;
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  });

  await Promise.all(promises);
  await db.write();

  res.json({
    code: 200,
    data: null,
  });
});

export default router;
