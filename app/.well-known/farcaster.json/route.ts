function withValidProperties(
  properties: Record<string, undefined | string | string[]>,
) {
  return Object.fromEntries(
    Object.entries(properties).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return !!value;
    }),
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL || "https://gifnouns.freezerverse.com";

  return Response.json({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER || "eyJmaWQiOjQxODY3MSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDFGRGUyN0YwMjM5YmY3OTA5OTdlRjRlNzQ5RWRCRDY2M0Y3NTU4RmIifQ",
      payload: process.env.FARCASTER_PAYLOAD || "eyJkb21haW4iOiJnaWZub3Vucy5mcmVlemVydmVyc2UuY29tIn0",
      signature: process.env.FARCASTER_SIGNATURE || "MHg5Yzg0YjgzNjQxMTUxOTI3OTBhM2E2ZmRkYjViMDE3MjY5YWUwZDc0Y2E4NjgxNzBmZGMxMzMyNmRmODBmZmRlNzFjZGU2MjMwNTJlYjJmNDg3ZDc3NTVlYjJjZDczZTI4MDg0NzJkZmI1Y2FiMmJlNjZlMDE4YTQ0NzQ5YjE5MTFi",
    },
    frame: withValidProperties({
      version: "1",
      name: "GifNouns",
      subtitle: "Create animated GifNouns",
      description: "Upload your Noun PFP, customize with noggle colors and animated eyes, then export as GIF. Join the community gallery!",
      screenshotUrls: [],
      iconUrl: `${URL}/icon.png`,
      splashImageUrl: `${URL}/splash.png`,
      splashBackgroundColor: "#8B5CF6",
      homeUrl: URL,
      webhookUrl: `${URL}/api/webhook`,
      primaryCategory: "art-creativity",
      tags: ["gifnouns", "nouns", "gif", "animation", "pfp", "community"],
      heroImageUrl: `${URL}/hero.png`,
      tagline: "Animate your GifNouns",
      ogTitle: "GifNouns",
      ogDescription: "Create animated GifNouns with custom noggles and eye animations",
      ogImageUrl: `${URL}/hero.png`,
    }),
  });
} 