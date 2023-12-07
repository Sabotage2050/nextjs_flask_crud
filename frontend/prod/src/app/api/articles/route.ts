import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { title, content, slug } = await req.json();
  const URL = process.env.API_ENDOPOINT as string;
  const res = await fetch(URL, {
    method: "POST",
    body: JSON.stringify({
      title: title,
      content: content,
      slug: slug,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-cache"
  });
  const articles = await res.json();

  return NextResponse.json(articles);
}
