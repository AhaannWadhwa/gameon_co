import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import FeedContainer from "@/components/feed/FeedContainer";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <MainLayout>
      {(view: "posts" | "events" | "people") => <FeedContainer view={view} />}
    </MainLayout>
  );
}
