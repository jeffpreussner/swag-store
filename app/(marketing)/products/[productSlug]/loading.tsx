import { Skeleton } from "@/components/ui/skeleton";

export default function FallbackLoader() {
  return (
    <div className="text-center text-lg mx-auto col-span-3 max-w-md p-4">
      <Skeleton className="h-[400px] w-full rounded-md" />
      <Skeleton className="h-8 w-3/4 mx-auto mt-4" />
      <Skeleton className="h-4 w-full mt-4" />
      <Skeleton className="h-4 w-5/6 mx-auto mt-2" />
      <Skeleton className="h-6 w-24 mx-auto mt-4" />
      <Skeleton className="h-10 w-36 mx-auto mt-4 rounded-md" />
    </div>
  );
}
