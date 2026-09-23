import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ReviewPhoto({ src, user }: { src: string; user: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="h-16 w-16 overflow-hidden rounded-md border border-border bg-muted"
        >
          <img src={src} alt={`Photo by ${user}`} className="h-full w-full object-cover" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-card">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">Photo by {user}</DialogTitle>
          <DialogDescription>Submitted with the review.</DialogDescription>
        </DialogHeader>
        <img
          src={src}
          alt={`Photo by ${user}`}
          className="max-h-[70vh] w-full rounded-md object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
