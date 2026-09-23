import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function IconButton({ label, children, className, onClick }: { label: string; children: React.ReactNode; className?: string; onClick?: () => void }) {
  return <Button type="button" variant="ghost" size="icon" className={cn("h-8 w-8 text-muted-foreground", className)} onClick={onClick} title={label} aria-label={label}>{children}</Button>;
}
