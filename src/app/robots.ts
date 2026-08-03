import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/login", "/admin/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/login", "/admin/"],
      },
    ],
    sitemap: "https://eduqash.uz/sitemap.xml",
    host: "https://eduqash.uz",
  };
}
