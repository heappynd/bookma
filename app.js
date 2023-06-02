import express from "express";
import marks from "./routes/marks.js";
import dirs from "./routes/dirs.js";

const PORT = 3000;

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use("/api/marks", marks);
app.use("/api/dirs", dirs);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
