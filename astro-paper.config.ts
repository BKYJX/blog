import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://blog.bkyjx.top",
    title: "BKYJ_X's blog",
    description: "BKYJ_X's blog",
    author: "BKYJ_X",
    profile: "https://github.com/BKYJX",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "Asia/Taipei",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/BKYJX/blog/edit/main/",
    },
    search: "pagefind",
  },
  socials: [
    { name: "github",    url: "https://github.com/BKYJX" },
    { name: "mail",      url: "mailto:bkyj_x@hotmail.com" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail",      url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
