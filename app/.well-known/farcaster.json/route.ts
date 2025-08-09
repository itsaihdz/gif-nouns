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
      header: process.env.FARCASTER_HEADER || "",
      payload: process.env.FARCASTER_PAYLOAD || "",
      signature: process.env.FARCASTER_SIGNATURE || "",
    },
    frame: withValidProperties({
      version: "1",
      name: "GifNouns.",
      subtitle: "Create animated Nouns",
      description: "Upload your Noun PFP, customize with noggle colors and animated eyes, then export as GIF. Join the community gallery!",
      screenshotUrls: [],
      iconUrl: `${URL}/icon.png`,
      splashImageUrl: `${URL}/splash.png`,
      splashBackgroundColor: "#8B5CF6",
      homeUrl: URL,
      webhookUrl: `${URL}/api/webhook`,
      primaryCategory: "art-creativity",
      tags: ["nouns", "gif", "animation", "pfp", "community"],
      heroImageUrl: `${URL}/hero.png`,
      tagline: "Animate your Nouns",
      ogTitle: "GifNouns",
      ogDescription: "Create animated Nouns with custom noggles and eye animations",
      ogImageUrl: `${URL}/hero.png`,
    }),
  });
} 