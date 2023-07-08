type WebsiteTitle = {
  title: string;
  icon: string | null;
};

export function getWebsiteTitle(url: string) {
  console.log('url', url)
  return new Promise<WebsiteTitle>((resolve, reject) => {
    if (url.startsWith("https://github.com")) {
      return resolve({ title: url.replace("https://github.com", ""), icon: null });
    }
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
