import { redirect } from "next/navigation";

export default function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  redirect("/login?mode=signup");
}
