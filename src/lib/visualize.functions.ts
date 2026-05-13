import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  text: z.string().min(20).max(4000),
  style: z.enum(["comic", "manga", "cinematic", "infographic"]).default("comic"),
});

type Panel = { caption: string; imageUrl: string };

const stylePrompts: Record<string, string> = {
  comic: "vibrant western comic book panel, bold ink outlines, halftone shading, dynamic action, speech bubbles area left blank",
  manga: "black and white manga panel, screentone shading, expressive characters, dramatic lines",
  cinematic: "cinematic film still, dramatic lighting, photorealistic, wide aspect storyboard frame",
  infographic: "clean modern infographic illustration, flat vector style, bold colors, iconography",
};

export const visualizeText = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<{ panels: Panel[] }> => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Step 1: Break text into 4 scene captions
    const planRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You convert reading material into 4 sequential visual scene descriptions for a storyboard. Each scene must be visually concrete (subjects, setting, action, mood). Respond with the tool only.",
          },
          { role: "user", content: data.text },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "make_storyboard",
              description: "Return 4 storyboard scenes",
              parameters: {
                type: "object",
                properties: {
                  scenes: {
                    type: "array",
                    minItems: 4,
                    maxItems: 4,
                    items: {
                      type: "object",
                      properties: {
                        caption: { type: "string", description: "1 short narration line under 18 words" },
                        visual: { type: "string", description: "concrete visual description of the scene" },
                      },
                      required: ["caption", "visual"],
                    },
                  },
                },
                required: ["scenes"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "make_storyboard" } },
      }),
    });

    if (!planRes.ok) {
      const t = await planRes.text();
      throw new Error(`Planner failed: ${planRes.status} ${t}`);
    }
    const planJson = await planRes.json();
    const args = planJson.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const parsed = JSON.parse(args || "{}");
    const scenes: Array<{ caption: string; visual: string }> = parsed.scenes ?? [];

    // Step 2: Generate an image per scene (parallel)
    const styleHint = stylePrompts[data.style];
    const images = await Promise.all(
      scenes.map(async (scene) => {
        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image",
            messages: [
              {
                role: "user",
                content: `${styleHint}. Scene: ${scene.visual}`,
              },
            ],
            modalities: ["image", "text"],
          }),
        });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(`Image gen failed: ${res.status} ${t}`);
        }
        const j = await res.json();
        const url = j.choices?.[0]?.message?.images?.[0]?.image_url?.url ?? "";
        return url;
      })
    );

    return {
      panels: scenes.map((s, i) => ({ caption: s.caption, imageUrl: images[i] })),
    };
  });
