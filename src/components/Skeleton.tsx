import { cn } from '../lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 rounded-2xl",
        className
      )}
    />
  );
}

export function BookingSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-2xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-20 rounded-lg" />
        <Skeleton className="h-6 w-20 rounded-lg" />
        <Skeleton className="h-6 w-20 rounded-lg" />
      </div>
    </div>
  );
}

export function LidoSkeleton() {
  return (
    <div className="rounded-3xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      <Skeleton className="aspect-[2/1] rounded-none" />
      <div className="p-6 flex justify-between items-center">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
    </div>
  );
}
