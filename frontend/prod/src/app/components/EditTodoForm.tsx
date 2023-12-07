import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { TodoType } from "@/app/types/Todo";
import { apiClient } from "@/app/utils/apiClient";

type EditTodoFormProps = {
  id: number;
  todo: TodoType;
};

// Todo を編集するフォーム
const EditTodoForm = ({ id, todo }: EditTodoFormProps) => {
  const router = useRouter();
  // フォームの入力値を管理するstate
  const [name, setName] = useState("");

  // フォームの入力値を管理するstate
  const [contents, setcontents] = useState("");

  useEffect(() => {
    setName(todo.name);
    setcontents(todo.contents);
  }, [todo]);

  // フォームの入力値を更新する関数
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // APIを呼び出して、Todoを更新する
      await apiClient.put(`item/${id}`, { name, contents });

      if (!confirm("Are you sure?")) {
        return;
      }

      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-10">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          defaultValue={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-5 block  text-base border border-black w-28"
        />
        <textarea
          defaultValue={contents}
          onChange={(e) => setcontents(e.target.value)}
          className="mt-3 border border-black focus:border-gray-500 max-w-md h-20"
        />

        <button
          type="submit"
          className="mt-3 p-1 rounded-md w-20 text-white bg-blue-700"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditTodoForm;
