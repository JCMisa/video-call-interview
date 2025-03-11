import ModeToggle from "@/components/ModeToggle";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="m-10">
      <SignedOut>
        <Link href="/sign-in">Sign in</Link>
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>

      <div>
        <ModeToggle />
      </div>
    </div>
  );
}
