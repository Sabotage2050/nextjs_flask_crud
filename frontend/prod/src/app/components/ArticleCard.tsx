import NextLink from "next/link";
import { Article } from "@/app/types/types";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <NextLink href={`/articles/${article.id}`}>
      <div className=" font-serif border border-black max-w-md">
        {/* tailwindで要素に下線を引く方法 */}

        <div className="text-lg text-blue-900">{article.title}...</div>
      </div>
    </NextLink>
  );
}
