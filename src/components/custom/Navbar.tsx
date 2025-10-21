"use client";

import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import ModeToggle from "../ModeToggle";
import Image from "next/image";
import DashboardBtn from "./DashboardBtn";
import { Button } from "../ui/button";
import { useUserRole } from "@/hooks/useUserRole";
import { useEffect, useState } from "react";
import { getUserByClerkId } from "../../../convex/users";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const Navbar = () => {
  const { user } = useUser();
  const { isInterviewer } = useUserRole();

  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const userData = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id || "",
  });

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
            {isInterviewer && <DashboardBtn />}
            <ModeToggle />
            <div className="flex items-center gap-2">
              <UserButton />
              <div className="flex flex-col items-start leading-tight">
                <p className="text-sm font-bold">{userData?.name}</p>
                <span className="text-xs text-muted-foreground uppercase font-bold">
                  {userData?.role}
                </span>
              </div>
            </div>
          </div>
        </SignedIn>
        <SignedOut>
          <div className="flex items-center space-x-4 ml-auto">
            <ModeToggle />
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
