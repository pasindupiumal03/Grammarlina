import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const publicRoutes = [
    "/",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/login",
    "/register",
  ]

  return publicRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }))
}


