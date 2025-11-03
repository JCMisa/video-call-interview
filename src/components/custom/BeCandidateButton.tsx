import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import Link from "next/link";
import { LinkIcon, Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import ViewRequests from "./ViewRequests";
import { useUser } from "@clerk/nextjs";

const BeCandidateButton = ({
  user,
  defaultRole,
}: {
  user: UserType;
  defaultRole: string;
}) => {
  const { isLoaded, isSignedIn } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const [requestedRole, setRequestedRole] = useState(defaultRole);
  const [requestedRoleReason, setRequestedRoleReason] = useState("");
  const [proof, setProof] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoaded || !isSignedIn) return null;

  const addRequest = useMutation(api.roleChange.addRoleChangeRequest);
  const userRequests =
    useQuery(api.roleChange.getUserRequests, {
      clerkId: user?.clerkId,
    }) || [];

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      await addRequest({
        requestedBy: user?.clerkId,
        requestorName: user?.name,
        currentRole: user?.role,
        requestedRole: requestedRole,
        requestReason: requestedRoleReason,
        requestProof: proof,
      });

      toast.success("Request submitted");
      setRequestedRoleReason("");
      setProof("");
      setIsOpen(false);
    } catch (error) {
      console.log("Submit role change request error: ", error);
      toast.error("Failed to submit request");
    } finally {
      setIsLoading(false);
    }
  };

  if (userRequests?.length >= 1 && user.role !== "teacher") {
    return (
      // <Button variant={"destructive"} disabled>
      //   Out of Request
      // </Button>
      null
    );
  } else {
    return (
      <div className="flex flex-col gap-2">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant={"outline"}>Request Role Change</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request a Role Change</DialogTitle>
              <DialogDescription>
                Request to be a student or LCEST teacher. Your request will be
                validated by the Administrator.
              </DialogDescription>
            </DialogHeader>

            <div className="my-5 flex flex-col space-y-6">
              <div className="flex flex-col gap-1 w-full">
                <Label className="text-xs text-gray-500 dark:text-gray-400">
                  What role do you request?
                </Label>
                <Select
                  onValueChange={(value) =>
                    setRequestedRole(value ? value : defaultRole)
                  }
                  defaultValue={defaultRole}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Role" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {user.role !== "student" && (
                      <SelectItem value="admin">Admin</SelectItem>
                    )}
                    <SelectItem value="teacher">Teacher</SelectItem>
                    {user.role !== "teacher" && (
                      <SelectItem value="student">Student</SelectItem>
                    )}
                    {user.role !== "teacher" && (
                      <SelectItem value="guest">Guest</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <Label className="text-xs text-gray-500 dark:text-gray-400">
                  Role change reason
                </Label>
                <Textarea
                  rows={5}
                  placeholder="Provide reason why you want to change your role..."
                  onChange={(e) => setRequestedRoleReason(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <Label className="text-xs text-gray-500 dark:text-gray-400">
                  Attach a proof to verifiy your claim
                </Label>
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    className="w-full col-span-2"
                    placeholder="https://..."
                    onChange={(e) => setProof(e.target.value)}
                  />
                  <Button asChild variant={"outline"}>
                    <Link
                      href={"https://imgbb.com/"}
                      target="_blank"
                      className="flex items-center gap-2"
                    >
                      <LinkIcon className="size-4" />
                      Convert to Link
                    </Link>
                  </Button>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Convert your proof to a link and paste the direct link to the
                  input field to verify your claim.
                </span>
              </div>

              <DialogFooter className="mt-5">
                <Button type="submit" onClick={handleSubmit}>
                  {isLoading ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
        {/* {userRequests?.length > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            You only have {5 - userRequests?.length} role change requests left.{" "}
            <ViewRequests
              userRequests={userRequests as UserRequestType[]}
              currentUserRole={user?.role}
            />
          </div>
        )} */}
      </div>
    );
  }
};

export default BeCandidateButton;
