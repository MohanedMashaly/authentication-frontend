import type { Route } from "../+types/root";
import AuthComponent from "~/authentication/Authentication";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Signup form" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <AuthComponent />;
}
