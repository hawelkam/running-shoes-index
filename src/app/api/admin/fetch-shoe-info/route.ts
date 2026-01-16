import { NextRequest, NextResponse } from "next/server";

import {
  getStravaUser,
  getUserFromDatabase,
} from "@/utils/auth/stravaAuthServer";

interface PerplexityMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface PerplexityResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export interface ShoeInfoResponse {
  name?: string;
  brand?: string;
  purpose?: string;
  releaseInfo?: {
    pl?: { date?: string; price?: number };
    eu?: { date?: string; price?: number };
    us?: { date?: string; price?: number };
  };
  stability?: string;
  categories?: string[];
  wideAvailable?: boolean;
  specs?: {
    m?: { weight?: number; drop?: number; heelStack?: number };
    w?: { weight?: number; drop?: number; heelStack?: number };
    upper?: string;
    foam?: string;
    plate?: string;
    outsole?: string;
  };
  description?: string;
}

const SCHEMA_PROMPT = `I'm keeping running shoes information in Sanity.io. Get me information about "{shoeName}" that fulfills the following schema:
fields: [
defineField({
title: 'Name',
name: 'name',
type: 'string',
}),
defineField({
title: 'Brand',
name: 'brand',
type: 'string',
}),
defineField({
title: 'Purpose',
name: 'purpose',
type: 'string',
options: {
list: [
{title: 'Road', value: 'Road'},
{title: 'Trail', value: 'Trail'},
{title: 'Gravel', value: 'Gravel'},
{title: 'Gym / Treadmill', value: 'Gym / Treadmill'},
{title: 'Track', value: 'Track'},
],
},
}),
defineField({
title: 'Release info',
name: 'releaseInfo',
type: 'object',
fields: [
{
title: 'Poland',
name: 'pl',
type: 'object',
fields: [
{title: 'Date', name: 'date', type: 'date'},
{title: 'Price', name: 'price', type: 'number'},
],
},
{
title: 'Europe',
name: 'eu',
type: 'object',
fields: [
{title: 'Date', name: 'date', type: 'date'},
{title: 'Price', name: 'price', type: 'number'},
],
},
{
title: 'USA',
name: 'us',
type: 'object',
fields: [
{title: 'Date', name: 'date', type: 'date'},
{title: 'Price', name: 'price', type: 'number'},
],
},
],
}),
defineField({
title: 'Stability',
name: 'stability',
type: 'string',
options: {
list: [
{title: 'Stable', value: 'stable'},
{title: 'Neutral', value: 'neutral'},
],
},
}),
defineField({
title: 'Categories',
name: 'categories',
type: 'array',
of: [
{
type: 'string',
options: {
list: [
{title: 'Waterproof', value: 'Waterproof'},
{title: 'Lifestyle', value: 'Lifestyle'},
{title: 'Lightweight', value: 'Lightweight'},
{title: 'Supertrainer', value: 'Supertrainer'},
{title: 'Long run', value: 'Long run'},
{title: 'Race day', value: 'Race day'},
{title: 'Tempo', value: 'Tempo'},
{title: 'Stability trainer', value: 'Stability trainer'},
{title: 'Daily trainer', value: 'Daily trainer'},
{title: '5k/10k', value: '5k/10k'},
{title: '21k/42k', value: '21k/42k'},
{title: 'Ultra', value: 'Ultra'},
],
},
},
],
}),
defineField({
title: 'Wide available',
name: 'wideAvailable',
type: 'boolean',
}),
defineField({
title: 'Specs',
name: 'specs',
type: 'object',
fields: [
{
title: "Men's",
name: 'm',
type: 'object',
fields: [
{
title: 'Weight',
name: 'weight',
type: 'number',
},
{
title: 'Drop',
name: 'drop',
type: 'number',
},
{
title: 'Heel stack',
name: 'heelStack',
type: 'number',
},
],
},
{
title: "Women's",
name: 'w',
type: 'object',
fields: [
{
title: 'Weight',
name: 'weight',
type: 'number',
},
{
title: 'Drop',
name: 'drop',
type: 'number',
},
{
title: 'Heel stack',
name: 'heelStack',
type: 'number',
},
],
},
{
title: 'Upper',
name: 'upper',
type: 'string',
},
{
title: 'Foam',
name: 'foam',
type: 'string',
},
{
title: 'Plate',
name: 'plate',
type: 'string',
},
{
title: 'Outsole',
name: 'outsole',
type: 'string',
},
],
}),
defineField({
title: 'Official description',
name: 'description',
type: 'text',
}),
],

Only provide the information that you are sure of. If there is no information about something use null. For pricing - use official manufacturer's websites as main source.

Output MUST BE JSON.`;

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const stravaUser = await getStravaUser();
    if (!stravaUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await getUserFromDatabase(stravaUser.stravaRefreshToken);
    if (!dbUser || dbUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await request.json()) as { shoeName: string };

    if (!body.shoeName || body.shoeName.trim().length < 2) {
      return NextResponse.json(
        { error: "Please provide a valid shoe name" },
        { status: 400 }
      );
    }

    const perplexityApiKey = process.env["PERPLEXITY_API_KEY"];
    if (!perplexityApiKey) {
      return NextResponse.json(
        { error: "Perplexity API key not configured" },
        { status: 500 }
      );
    }

    const prompt = SCHEMA_PROMPT.replace("{shoeName}", body.shoeName.trim());

    const messages: PerplexityMessage[] = [
      {
        role: "system",
        content:
          "You are a helpful assistant that provides accurate information about running shoes. Always respond with valid JSON only, no markdown formatting or code blocks.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${perplexityApiKey}`,
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages,
        max_tokens: 2000,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Perplexity API error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch shoe information from Perplexity" },
        { status: 502 }
      );
    }

    const data = (await response.json()) as PerplexityResponse;
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response from Perplexity" },
        { status: 502 }
      );
    }

    // Try to parse the JSON response
    // Remove potential markdown code blocks
    let jsonContent = content
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    // Try to find JSON object in the response
    const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonContent = jsonMatch[0];
    }

    try {
      const shoeInfo = JSON.parse(jsonContent) as ShoeInfoResponse;
      return NextResponse.json({ success: true, data: shoeInfo });
    } catch {
      console.error("Failed to parse Perplexity response as JSON:", content);
      return NextResponse.json(
        { error: "Failed to parse shoe information", rawContent: content },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching shoe info:", error);
    return NextResponse.json(
      { error: "Failed to fetch shoe information" },
      { status: 500 }
    );
  }
}
