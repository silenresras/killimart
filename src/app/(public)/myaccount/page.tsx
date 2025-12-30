// app/myaccount/page.tsx
import { redirect } from "next/navigation";

export default function MyAccountRootPage() {
  redirect("/myaccount/overview");
}
