/* eslint-disable @next/next/no-async-client-component */
"use client";
import type { Article } from "@/app/types/types";
import ArticleList from "./components/ArticleList";
import Link from "next/link";
import { useState, useEffect } from "react";

export default async function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  useEffect(() => {
    const getArticles = async () => {
      const URL = process.env.NEXT_PUBLIC_API_ENDOPOINT as string;
      const res = await fetch(URL, {
        cache: "no-cache",
      });

      // エラーハンドリングを行うことが推奨されている
      if (!res.ok) {
        throw new Error("Failed to fetch articles");
      }

      const data = await res.json();
      setArticles(data);
    };
    getArticles();
  }, []);

  return (
    <div className="mt-4">
      <Link
        href="/articles/new"
        className=" text-lg text-red-800 bg-white border-2 border-red-800 rounded-md p-1"
      >
        new post
      </Link>
      <h1 className="text-lg bg-gray-600 mt-3">New line</h1>
      <ArticleList articles={articles} />
    </div>
  );
}
