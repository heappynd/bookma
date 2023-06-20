const storage = useStorage('db')

export type Mark = {
  id: string
  href: string
  add_date: number
  text: string
  dir_id: string
  icon: string
}
export type Dir = {
  id: string
  name: string
}

export const getMarksPromise = () => {
  return new Promise<Mark[]>((resolve, reject) => {
    storage.getItem('marks').then((res) => {
      resolve((res as Mark[]) ?? [])
    })
  })
}

export const getDirsPromise = () => {
  return new Promise<Dir[]>((resolve, reject) => {
    storage.getItem('dirs').then((res) => {
      resolve((res as Dir[]) ?? [])
    })
  })
}
