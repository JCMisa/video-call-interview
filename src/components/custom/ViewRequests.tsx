import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DataTable } from "../dataTable/roleChange/roleChange-data-table";
import { columns } from "../dataTable/roleChange/roleChange-columns";

const ViewRequests = ({
  userRequests,
  currentUserRole,
}: {
  userRequests: UserRequestType[];
  currentUserRole: string;
}) => {
  return (
    <Sheet>
      <SheetTrigger className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary transition-all underline">
        View
      </SheetTrigger>
      <SheetContent
        side={"bottom"}
        className="h-[80vh] overflow-hidden flex flex-col"
      >
        <SheetHeader>
          <SheetTitle>Your Role Change Requests</SheetTitle>
          <SheetDescription>
            Showing the list of your role change requests.
          </SheetDescription>
        </SheetHeader>

        <div className="my-5">
          <DataTable
            columns={columns}
            data={userRequests?.length > 0 ? userRequests : []}
            // query1="requestOwner"
            showCreate={false}
            currentUserRole={currentUserRole}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ViewRequests;
