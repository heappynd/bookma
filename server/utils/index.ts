type WebsiteTitle = {
  title: string;
  icon: string | null;
};

export function getWebsiteTitle(url: string) {
  return new Promise<WebsiteTitle>((resolve, reject) => {
    $fetch<string>(url)
      .then((response) => {
        const title = response.match(/<title>([\s\S]+)<\/title>/i)?.[1];
        resolve({ title: title || url, icon: null });
      })
      .catch(() => {
        resolve({ title: url, icon: null });
      });
  });
}
