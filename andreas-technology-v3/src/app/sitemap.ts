import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://andreas.technology',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        // Add thesis-presentation back once the page/route exists at that URL
        // { url: 'https://andreas.technology/thesis-presentation', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
    ]
}
