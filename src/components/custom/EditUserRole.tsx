import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoaderCircleIcon, PencilIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import toast from "react-hot-toast";

const EditUserRole = ({
  userClerkId,
  requestId,
}: {
  userClerkId: string;
  requestId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const roleChangeRequest = useQuery(api.roleChange.getRequestById, {
    requestId: requestId || "",
  });

  const [updatedRole, setUpdatedRole] = useState<
    "guest" | "student" | "teacher" | "admin"
  >(
    (roleChangeRequest?.currentRole as
      | "guest"
      | "student"
      | "teacher"
      | "admin") || "guest"
  );

  const updateUserRole = useMutation(api.users.updateUserRole);
  const updateRequestStatus = useMutation(api.roleChange.updateRequestStatus);
  const handleChangeRole = async () => {
    setLoading(true);

    try {
      const updateRole = await updateUserRole({
        clerkId: userClerkId, // clerkId of user
        updatedRole: updatedRole,
      });
      if (roleChangeRequest?._id) {
        await updateRequestStatus({
          id: roleChangeRequest._id,
          status: "approved",
        });
      }

      toast.success("Role changed successfully");
      setIsOpen(false);
    } catch (error) {
      console.log("error changing user role: ", error);
      toast.error("Failed to change role");
    } finally {
      setLoading(false);
    }
  };

  const rejectChangeRole = async () => {
    if (roleChangeRequest?._id) {
      await updateRequestStatus({
        id: roleChangeRequest._id,
        status: "rejected",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2 p-2 hover:bg-light hover:text-dark transition-all w-full rounded-sm cursor-pointer">
          <PencilIcon className="h-4 w-4 mr-2" />
          <p className="text-sm">Change Role</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-between mt-5">
            <DialogTitle>Manage User Role</DialogTitle>
            <Button
              variant={"destructive"}
              onClick={rejectChangeRole}
              disabled={loading}
            >
              {loading ? (
                <LoaderCircleIcon className="h-5 w-5 animate-spin" />
              ) : (
                "Reject"
              )}
            </Button>
          </div>
          <DialogDescription>
            Grant user&apos;s request to change their role.
          </DialogDescription>
        </DialogHeader>

        <div className="my-5 flex flex-col space-y-6">
          <div className="flex flex-col gap-1 w-full">
            <Label className="text-xs text-gray-500 dark:text-gray-400">
              Select a role
            </Label>
            <Select
              onValueChange={(value) =>
                setUpdatedRole(
                  value
                    ? (value as "guest" | "student" | "teacher" | "admin")
                    : (roleChangeRequest?.currentRole as
                        | "guest"
                        | "student"
                        | "teacher"
                        | "admin")
                )
              }
              defaultValue={roleChangeRequest?.currentRole}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Role" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="guest">Guest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="mt-5">
            <Button type="submit" onClick={handleChangeRole}>
              {loading ? (
                <LoaderCircleIcon className="h-5 w-5 animate-spin" />
              ) : (
                "Grant"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserRole;
