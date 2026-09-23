import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function TransactionPagination({ count }: { count: number }) {
  return (
    <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <span>{count} total</span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft />
          Previous
        </Button>
        <span className="px-2">Page 1 of 1</span>
        <Button variant="outline" size="sm" disabled>
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
