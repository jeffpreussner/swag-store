import { Skeleton } from "@/components/ui/skeleton";
export default function CartLoader() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}
