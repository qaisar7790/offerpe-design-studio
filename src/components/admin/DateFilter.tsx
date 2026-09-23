import { Input } from "@/components/ui/input";
import { useState } from "react";

export function DateFilter() {
  const [from, setFrom] = useState("2026-09-01");
  const [to, setTo] = useState("2026-09-21");

  return (
    <>
      <Input
        type="date"
        aria-label="From date"
        title="From date"
        className="w-full shrink-0 lg:w-38"
        value={from}
        onChange={(event) => setFrom(event.target.value)}
      />
      <Input
        type="date"
        aria-label="To date"
        title="To date"
        className="w-full shrink-0 lg:w-38"
        value={to}
        onChange={(event) => setTo(event.target.value)}
      />
    </>
  );
}
