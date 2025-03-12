import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import ModeToggle from "../ModeToggle";
import Image from "next/image";
import DashboardBtn from "./DashboardBtn";
import { Button } from "../ui/button";

const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        {/* LEFT SIDE -LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-2xl mr-6 font-mono hover:opacity-80 transition-opacity"
        >
          <Image
            src={"/logo.svg"}
            alt="logo"
            loading="lazy"
            placeholder="blur"
            blurDataURL="/blur.jpg"
            width={1000}
            height={1000}
            className="size-8"
          />
          <span className="bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent">
            Intervia
          </span>
        </Link>

        {/* RIGHT SIDE - ACTIONS */}
        <SignedIn>
          <div className="flex items-center space-x-4 ml-auto">
            <DashboardBtn />
            <ModeToggle />
            <UserButton />
          </div>
        </SignedIn>
        <SignedOut>
          <div className="flex items-center space-x-4 ml-auto">
            <SignInButton>
              <Button className="min-w-32 max-w-32">Sign in</Button>
            </SignInButton>
          </div>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;
