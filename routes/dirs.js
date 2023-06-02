import express from "express";
import db from "../db.js";
import { v4 as uuidv4 } from "uuid";
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log("Time: ", Date.now(), req.baseUrl + req.url);
  next();
});
// define the home page route
router.get("/", async (req, res) => {
  await db.read();
  const dirs = db.data.dirs;
  res.json({
    code: 200,
    data: dirs,
  });
});
// define the about route
router.post("/", async (req, res) => {
  await db.read();
  const dirs = db.data.dirs;
  const dir = {
    id: uuidv4(),
    name: req.body.name,
  };
  dirs.push(dir);
  await db.write();
  res.json({
    code: 200,
    data: dir,
  });
});

router.delete("/:id", async (req, res) => {
  await db.read();
  const dirs = db.data.dirs;
  const idx = dirs.findIndex((item) => item.id === req.params.id);
  dirs.splice(idx, 1);
  await db.write();
  res.json({
    code: 200,
    data: null,
  });
});

export default router;
