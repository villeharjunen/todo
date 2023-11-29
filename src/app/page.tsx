import dynamic from "next/dynamic";
const Todo = dynamic(() => import("./todo"), { ssr: false });

export default function Page() {
  return <Todo></Todo>;
}
