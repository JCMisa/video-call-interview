import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import UserManagementPage from "@/components/custom/UserManagementPage";

export default async function UsersListPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <UserManagementPage />;
}
