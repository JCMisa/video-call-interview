import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";
import { LoaderCircleIcon } from "lucide-react";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <ClerkLoading>
        <LoaderCircleIcon className="size-5 animate-spin" />
      </ClerkLoading>
      <ClerkLoaded>
        <SignUp />
      </ClerkLoaded>
    </div>
  );
};

export default SignUpPage;
