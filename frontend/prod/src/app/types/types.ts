export type Article = {
  id: number;
  title: string;
  content: string;
  slug: string;
  created_at: string;
  updated_at: string;
  comments: Comment[];
};

export type Comment = {
  id: number;
  body: string;
  articleId: number;
  created_at: string;
  updated_at: string;
};
