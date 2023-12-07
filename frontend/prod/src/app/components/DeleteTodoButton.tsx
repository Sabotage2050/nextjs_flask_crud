import { Router, useRouter } from "next/router";
import axios from "axios";
import { apiClient } from "@/app/utils/apiClient";

type DeleteTodoButtonProps = {
  id: number;
};

// Todoを削除するボタン
const DeleteTodoButton = ({ id }: DeleteTodoButtonProps) => {
  const router = useRouter();
  // Todoを削除する関数
  const handleDelete = async () => {
    // ルーティング情報を取得する
    // 確認のダイアログを表示
    if (!confirm("Are you sure?")) {
      return;
    }

    try {
      // APIを呼び出して、Todoを削除する
      await apiClient.delete(`item/${id}`);

      // 削除に成功したらトップページに遷移
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleDelete} className="mt-5 ">
      <div className=" p-1 rounded-md bg-blue-700 text-white">Delete</div>
    </button>
  );
};

export default DeleteTodoButton;
