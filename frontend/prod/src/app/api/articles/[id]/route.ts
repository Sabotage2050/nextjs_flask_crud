import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const URL = process.env.API_ENDOPOINT as string;
  const res = await fetch(`${URL}/${id}`, {
    cache: "no-cache",
  });
  const articles = await res.json();

  return NextResponse.json(articles);
}
