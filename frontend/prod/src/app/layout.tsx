import Link from "next/link";
import { Suspense } from "react";
import Loading from "./components/loading";
import "@/app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <title>zatudan</title>
      </head>
      <body className="bg-gray-300">
        <header className="mt-2 mb-4">
          <Link href="/" className="text-blue-800">
            Home
          </Link>
        </header>
        <Suspense fallback={<Loading />}>{children}</Suspense>
        <footer>
          <small>misozi</small>
        </footer>
      </body>
    </html>
  );
}
