import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const Loader = ({ className }: { className?: string }) => {
  return (
    <Loader2
      className={cn("my-28 h-10 w-10 text-primary/60 animate-spin", className)}
    />
  );
};

export default Loader;
