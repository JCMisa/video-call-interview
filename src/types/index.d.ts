declare type UserType = {
  _id: Id<"users">;
  _creationTime: number;
  image?: string | undefined;
  name: string;
  role: "admin" | "teacher" | "student" | "guest";
  email: string;
  clerkId: string;
};

declare type UserRequestType = {
  _id: Id<"roleChange">;
  _creationTime: number;
  requestReason?: string | undefined;
  requestProof?: string | undefined;
  status: "pending" | "approved" | "rejected";
  requestedBy: string;
  currentRole: string;
  requestedRole: string;
};
