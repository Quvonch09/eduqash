import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/*?center="],
      },
    ],
    sitemap: "https://eduqash.uz/sitemap.xml",
    host: "https://eduqash.uz",
  };
}
