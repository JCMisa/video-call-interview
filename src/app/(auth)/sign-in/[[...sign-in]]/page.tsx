import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import { LoaderCircleIcon } from "lucide-react";
import React from "react";

const SignInPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <ClerkLoading>
        <LoaderCircleIcon className="size-5 animate-spin" />
      </ClerkLoading>
      <ClerkLoaded>
        <SignIn />
      </ClerkLoaded>
    </div>
  );
};

export default SignInPage;
