import { MoreHorizontalIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const InterviewDataCard = ({
  totalInterviews,
  successfullInterviews,
  failedInterviews,
}: {
  totalInterviews: number;
  successfullInterviews: number;
  failedInterviews: number;
}) => {
  return (
    <div className="rounded-lg bg-neutral-200 dark:bg-neutral-800 p-2 flex flex-col items-start gap-4 relative">
      <span className="text-sm text-muted-foreground tracking-wider">
        Total Interviews
      </span>
      <p className="text-xl font-bold">{totalInterviews}</p>

      <Popover>
        <PopoverTrigger>
          <MoreHorizontalIcon className="absolute bottom-2 right-2 cursor-pointer size-5" />
        </PopoverTrigger>
        <PopoverContent className="flex flex-col items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              <div className="rounded-full bg-green-500 size-2" />
              <p className="text-xs text-muted-foreground">
                Successfull Interviews
              </p>
            </div>
            <p className="text-sm font-semibold">{successfullInterviews}</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              <div className="rounded-full bg-blue-500 size-2" />
              <p className="text-xs text-muted-foreground">Failed Interviews</p>
            </div>
            <p className="text-sm font-semibold">{failedInterviews}</p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default InterviewDataCard;
