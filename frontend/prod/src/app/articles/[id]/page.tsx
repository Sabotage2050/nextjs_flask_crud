/* eslint-disable @next/next/no-async-client-component */
"use client";
import { notFound } from "next/navigation";
import React, {
  TextareaHTMLAttributes,
  useCallback,
  useRef,
  useTransition,
} from "react";
import { Article, Comment } from "@/app/types/types";

import type { Metadata, ResolvingMetadata } from "next";
import { Suspense, useEffect, useState } from "react";

export default async function ArticleDetail({
  params,
}: {
  params: { id: string };
}) {
  const [article, setArticle] = useState<Article>({
    id: 0,
    title: "",
    content: "",
    slug: "",
    created_at: "",
    updated_at: "",
    comments: [],
  });

  const [comments, setComments] = useState<Comment[]>([]);

  const bodyRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  async function createComment(articleId: string, body: string) {
    await fetch(`/api/articles/${articleId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body }),
    });
  }

  const handleChange = (event: any) => {
    bodyRef.current = event.target.value;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    await createComment(params.id, bodyRef.current);
    setLoading(false);
    startTransition(() => {
      location.reload();
    });
  };
  useEffect(() => {
    const getArticle = async (id: string) => {
      const res = await fetch(`/api/articles/${id}`, {
        cache: "no-cache",
      });

      if (res.status === 404) {
        return notFound();
      }

      if (!res.ok) {
        throw new Error("Failed to fetch articles");
      }

      const data = await res.json();
      setArticle(data);
    };

    const getComments = async (id: string) => {
      const res = await fetch(`/api/articles/${id}/comments`, {
        cache: "no-cache",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch articles");
      }

      const data = await res.json();
      setComments(data);
    };
    getArticle(params.id);
    getComments(params.id);
  }, []);

  return (
    <div className="m-10">
      <h1 className="text-xl font-serif">{article.title}</h1>
      <h2 className="mt-5 ml-24  px-2 font-serif border border-black w-32">
        new comment
      </h2>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            className="w-96 h-24 focus:bg-gray-100 bg-gray-300 border border-black"
            id="body"
            onChange={handleChange}
          />
        </div>
        <button
          className="font-serif  text-black text-xs border-2 border-black p-1"
          type="submit"
          disabled={loading}
        >
          {loading ? "now sending" : "send"}
        </button>
      </form>
      <p className=" text-lg mt-3">{article.content}</p>
      <h2 className="mt-10 text-2xl font-serif">Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id} className="max-w-md border border-black">
            {comment.body}
          </li>
        ))}
      </ul>
    </div>
  );
}
