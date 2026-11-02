import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import NavbarContent from "./NavbarContent";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <NavbarContent session={session} />;
}