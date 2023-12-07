import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      id: string;
    };
  }
) {
  const id = params.id;
  const URL = process.env.API_ENDOPOINT as string;
  const res = await fetch(`${URL}/${id}/comments`);
  const comments = await res.json();

  return NextResponse.json(comments);
}

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: {
      id: string;
    };
  }
) {
  const { body } = await req.json();
  const id = params.id;
  console.log(id);
  const URL = process.env.API_ENDOPOINT as string;
  const res = await fetch(`${URL}/${id}/comments`, {
    method: "POST",
    body: JSON.stringify({
      body: body,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  });
  const articles = await res.json();

  return NextResponse.json(articles);
}
