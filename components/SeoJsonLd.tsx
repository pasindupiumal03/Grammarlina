import React from "react"

type SeoJsonLdProps = {
  schema: Record<string, unknown> | Array<Record<string, unknown>>
}

export default function SeoJsonLd({ schema }: SeoJsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}


