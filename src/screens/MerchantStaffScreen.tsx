import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { CopyButton } from "@/components/admin/CopyButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { TransactionPagination } from "@/components/admin/TransactionPagination";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Merchant, MerchantStaff } from "@/types/admin";
import { format } from "date-fns";
import {
  Check,
  ChevronDown,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export function MerchantStaffDialog({
  staff,
  merchantOptions,
  onSave,
  children,
}: {
  staff: MerchantStaff | null;
  merchantOptions: string[];
  onSave: (staff: MerchantStaff, isNew: boolean) => void;
  children: React.ReactNode;
}) {
  const isNew = !staff;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(staff?.name ?? "");
  const [phone, setPhone] = useState(staff?.phone ?? "");
  const [merchant, setMerchant] = useState(staff?.merchant ?? merchantOptions[0] ?? "");
  const [role, setRole] = useState<MerchantStaff["role"]>(staff?.role ?? "Staff");

  const reset = () => {
    setName(staff?.name ?? "");
    setPhone(staff?.phone ?? "");
    setMerchant(staff?.merchant ?? merchantOptions[0] ?? "");
    setRole(staff?.role ?? "Staff");
  };
  const phoneValid = /^\d{10,14}$/.test(phone.trim());
  const valid = name.trim().length > 0 && phoneValid && merchant.length > 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) reset();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg border-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {isNew ? "Invite staff member" : "Edit staff member"}
          </DialogTitle>
          <DialogDescription>
            Mobile number is the invite — if this number already has an account, they are linked to
            the merchant immediately. Otherwise they are linked automatically the next time they
            sign in.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <label className="block space-y-1.5 text-sm font-medium">
            Name <span className="text-destructive">*</span>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name as it appears in the merchant app"
            />
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            Phone number <span className="text-destructive">*</span>
            <Input
              value={phone}
              onChange={(event) => setPhone(event.target.value.replace(/[^\d]/g, ""))}
              placeholder="919000000001 (country code + number, no +)"
              inputMode="numeric"
            />
            {!phoneValid && phone.length > 0 && (
              <span className="block text-xs font-normal text-destructive">
                Enter the country code and number, digits only.
              </span>
            )}
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm font-medium">
              Merchant <span className="text-destructive">*</span>
              <Select value={merchant} onValueChange={setMerchant}>
                <SelectTrigger>
                  <SelectValue placeholder="Select merchant" />
                </SelectTrigger>
                <SelectContent>
                  {merchantOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              Role
              <Select
                value={role}
                onValueChange={(value) => setRole(value as MerchantStaff["role"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </label>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={!valid}
            onClick={() => {
              onSave(
                {
                  id: staff?.id ?? `MS-${Math.floor(1100 + Math.random() * 800)}`,
                  name: name.trim(),
                  phone: phone.trim(),
                  merchant,
                  role,
                  status: staff?.status ?? "Pending",
                  invitedOn: staff?.invitedOn ?? format(new Date(), "dd MMM yyyy"),
                  lastActive: staff?.lastActive ?? "—",
                },
                isNew,
              );
              setOpen(false);
            }}
          >
            {isNew ? (
              <>
                <Plus className="h-4 w-4" />
                Invite staff member
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function MerchantStaffPage({
  staff,
  onSave,
  onDelete,
  merchants,
}: {
  staff: MerchantStaff[];
  onSave: (member: MerchantStaff, isNew: boolean) => void;
  onDelete: (member: MerchantStaff) => void;
  merchants: readonly Merchant[];
}) {
  const merchantOptions = useMemo(
    () => Array.from(new Set(merchants.map((row) => row[0] as string))).sort(),
    [merchants],
  );
  const [query, setQuery] = useState("");
  const [merchantFilters, setMerchantFilters] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<MerchantStaff["status"][]>([]);

  const rows = staff.filter((member) => {
    const term = query.trim().toLowerCase();
    const matchesQuery =
      term.length === 0 ||
      member.name.toLowerCase().includes(term) ||
      member.phone.includes(term) ||
      member.id.toLowerCase().includes(term);
    const matchesMerchant =
      merchantFilters.length === 0 || merchantFilters.includes(member.merchant);
    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(member.status);
    return matchesQuery && matchesMerchant && matchesStatus;
  });
  const filtered = query.length > 0 || merchantFilters.length > 0 || statusFilters.length > 0;

  return (
    <>
      <PageHeader
        title="Merchant Staff"
        description="Every phone number that can sign in to the merchant app and confirm in-store redemptions, across all merchants. Mobile number is the invite — no email or password is involved."
        actions={
          <MerchantStaffDialog staff={null} merchantOptions={merchantOptions} onSave={onSave}>
            <Button>
              <Plus />
              Invite staff member
            </Button>
          </MerchantStaffDialog>
        }
      />

      <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card sm:flex-row sm:items-center">
        <div className="relative min-w-[280px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9"
            placeholder="Search by name, phone number, or staff ID…"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Merchant
              {merchantFilters.length > 0 && (
                <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
                  {merchantFilters.length}
                </span>
              )}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-72 w-56 overflow-y-auto">
            {merchantOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option}
                checked={merchantFilters.includes(option)}
                onCheckedChange={() =>
                  setMerchantFilters((current) =>
                    current.includes(option)
                      ? current.filter((item) => item !== option)
                      : [...current, option],
                  )
                }
              >
                {option}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Status
              {statusFilters.length > 0 && (
                <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
                  {statusFilters.length}
                </span>
              )}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {(["Active", "Pending"] as MerchantStaff["status"][]).map((option) => (
              <DropdownMenuCheckboxItem
                key={option}
                checked={statusFilters.includes(option)}
                onCheckedChange={() =>
                  setStatusFilters((current) =>
                    current.includes(option)
                      ? current.filter((item) => item !== option)
                      : [...current, option],
                  )
                }
              >
                {option}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {filtered && (
          <Button
            variant="ghost"
            onClick={() => {
              setQuery("");
              setMerchantFilters([]);
              setStatusFilters([]);
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-245 text-left text-sm">
          <thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground">
            <tr>
              <th>Staff ID</th>
              <th>Name</th>
              <th>Phone number</th>
              <th>Merchant</th>
              <th>Role</th>
              <th>Status</th>
              <th>Invited on</th>
              <th>Last active</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((member) => (
              <tr key={member.id} className="border-t border-border hover:bg-muted/50">
                <td>
                  <div className="flex items-center gap-1 font-mono text-xs">
                    {member.id}
                    <CopyButton value={member.id} />
                  </div>
                </td>
                <td className="font-semibold">{member.name}</td>
                <td>
                  <div className="flex items-center gap-1 font-mono text-xs">
                    {member.phone}
                    <CopyButton value={member.phone} />
                  </div>
                </td>
                <td>{member.merchant}</td>
                <td>{member.role}</td>
                <td>
                  <StatusBadge status={member.status} />
                </td>
                <td className="text-muted-foreground">{member.invitedOn}</td>
                <td className="text-muted-foreground">{member.lastActive}</td>
                <td>
                  <div className="flex items-center justify-end gap-1">
                    {member.status === "Pending" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          toast.success("Invite re-sent", {
                            description: `${member.name} will be linked to ${member.merchant} on their next sign-in.`,
                          })
                        }
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Resend
                      </Button>
                    )}
                    <MerchantStaffDialog
                      staff={member}
                      merchantOptions={merchantOptions}
                      onSave={onSave}
                    >
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </MerchantStaffDialog>
                    <ConfirmDeleteDialog
                      itemType="staff member"
                      name={member.name}
                      onConfirm={() => onDelete(member)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </Button>
                    </ConfirmDeleteDialog>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="py-10 text-center text-muted-foreground">
                  No staff match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <TransactionPagination count={rows.length} />
    </>
  );
}
