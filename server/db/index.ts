import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

export type Mark = {
  id: string;
  href: string;
  add_date: number;
  text: string;
  dir_id: string;
  icon: string;
}
export type Dir = {
  id: string
  name: string
}

type Data = {
  marks: Mark[]
  dirs: Dir[]
}

const adapter = new JSONFile<Data>('/tmp/db.json');
const db = new Low<Data>(adapter, { marks: [], dirs: [] });

export default db