import { redirect } from "next/navigation";

export default function Home() {
  // Directly redirect to the admin dashboard, as this is now a standalone conference app
  redirect("/admin");
}
