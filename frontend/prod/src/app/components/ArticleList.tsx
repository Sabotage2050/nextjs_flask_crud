import ArticleCard from "./ArticleCard";
import { Article } from "@/app/types/types";

export default function ArticleList({ articles }: { articles: Article[] }) {
  return (
    <div className="mt-2">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
