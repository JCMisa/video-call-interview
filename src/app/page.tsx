import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="m-10">
      <SignedIn>
        <SignOutButton>
          <Button variant="destructive">Sign out</Button>
        </SignOutButton>
      </SignedIn>

      <SignedOut>
        <SignInButton>
          <Button>Sign in</Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
