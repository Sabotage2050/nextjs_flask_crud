"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function CreateArticle() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState("siran");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, slug }),
      cache: "no-cache",
    });
    setLoading(false);
    router.push("/");
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div>
      <h1 className="font-serif text-lg">New Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <div className="font-serif text-lg">Title</div>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-48 focus:bg-gray-100 bg-gray-300 border border-black"
          />
        </div>
        <div>
          <div className="font-serif">content</div>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-96 h-24 focus:bg-gray-100 bg-gray-300 border border-black"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="border border-black"
        >
          {loading ? "送信中" : "送信"}
        </button>
      </form>
    </div>
  );
}
