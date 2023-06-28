const storage = useStorage("db");

export type Mark = {
  id: string;
  href: string;
  add_date: number;
  text: string;
  dir_id: string;
  icon: string;
};
export type Dir = {
  id: string;
  name: string;
};

export const getMarksPromise = () => {
  return storage.getItem<Mark[]>("marks").then((res) => res ?? []);
};

export const getDirsPromise = () => {
  return storage.getItem<Dir[]>("dirs").then((res) => res ?? []);
};
