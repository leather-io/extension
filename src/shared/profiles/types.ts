export interface PublicProfile {
    name: string,
    image: { "@type": "ImageObject", name: "avatar" | "background", contentUrl: string }[]
}