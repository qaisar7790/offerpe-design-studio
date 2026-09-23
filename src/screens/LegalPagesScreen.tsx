import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { ConfirmSaveDialog } from "@/components/admin/ConfirmSaveDialog";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { legalContentToHtml } from "@/lib/admin-utils";
import type { LegalPage, Merchant } from "@/types/admin";
import { Bold, Check, FileText, Heading2, Italic, List, ListOrdered, Redo2, Trash2, Undo2 } from "lucide-react";
import { Fragment, useRef, useState } from "react";

export function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const initialHtml = useRef(legalContentToHtml(value));

  const run = (command: string, argument?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, argument);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const tools: { label: string; icon: typeof Bold; onClick: () => void }[] = [
    { label: "Bold", icon: Bold, onClick: () => run("bold") },
    { label: "Italic", icon: Italic, onClick: () => run("italic") },
    { label: "Heading", icon: Heading2, onClick: () => run("formatBlock", "<h2>") },
    { label: "Bullet list", icon: List, onClick: () => run("insertUnorderedList") },
    { label: "Numbered list", icon: ListOrdered, onClick: () => run("insertOrderedList") },
    { label: "Undo", icon: Undo2, onClick: () => run("undo") },
    { label: "Redo", icon: Redo2, onClick: () => run("redo") },
  ];

  return <div className="overflow-hidden rounded-lg border border-border bg-card">
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 px-2 py-1.5">
      {tools.map((tool, index) => <Fragment key={tool.label}>
        {index === 5 ? <span className="mx-1 h-5 w-px bg-border" /> : null}
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title={tool.label} aria-label={tool.label} onMouseDown={(event) => event.preventDefault()} onClick={tool.onClick}>
          <tool.icon className="h-4 w-4" />
        </Button>
      </Fragment>)}
    </div>
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline="true"
      onInput={(event) => onChange(event.currentTarget.innerHTML)}
      className="max-h-[520px] min-h-[320px] overflow-y-auto px-4 py-3 text-sm leading-6 outline-none [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:font-heading [&_h2]:text-base [&_h2]:font-semibold [&_li]:mb-1 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
      dangerouslySetInnerHTML={{ __html: initialHtml.current }}
    />
  </div>;
}

export function LegalPagesPage({ pages, onSave, onDelete }: { pages: LegalPage[]; onSave: (page: LegalPage) => void; onDelete: (page: LegalPage) => void }) {
  const [selectedId, setSelectedId] = useState(pages[0]?.id ?? "");
  const selected = pages.find((page) => page.id === selectedId) ?? pages[0];
  const [draft, setDraft] = useState<LegalPage | null>(selected ?? null);
  const activeDraft = draft && selected && draft.id === selected.id ? draft : selected;

  if (!selected || !activeDraft) return <PageHeader title="Legal Pages" description="No legal pages have been created yet." />;

  const dirty = JSON.stringify(activeDraft) !== JSON.stringify(selected);
  const update = (patch: Partial<LegalPage>) => setDraft({ ...activeDraft, ...patch });
  const valid = activeDraft.title.trim().length > 0 && activeDraft.slug.trim().length > 0 && activeDraft.content.trim().length > 0;

  return <div className="space-y-5">
    <PageHeader title="Legal Pages" description="One editable document per page type — Privacy Policy and Terms of Service are fetched live on the public marketing site (apps/web); Merchant Agreement is linked from both Merchant Onboarding forms' terms checkbox. Unpublished changes are invisible to the public site until Published is checked." />

    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card sm:flex-row sm:items-center">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Page</span>
      </div>
      <Select value={activeDraft.id} onValueChange={(value) => { setSelectedId(value); setDraft(pages.find((page) => page.id === value) ?? null); }}>
        <SelectTrigger className="h-9 w-full sm:w-[280px]"><SelectValue /></SelectTrigger>
        <SelectContent>{pages.map((page) => <SelectItem key={page.id} value={page.id}>{page.name}</SelectItem>)}</SelectContent>
      </Select>
      <div className="flex flex-1 items-center justify-end gap-2 text-xs text-muted-foreground">
        <StatusBadge status={selected.published ? "Active" : "Inactive"} />
        <span>{selected.published ? "Published" : "Unpublished"}</span>
        <span>Last updated {selected.updatedAt}</span>
      </div>
    </div>

    <section className="rounded-lg border border-border bg-card shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
        <h2 className="font-heading text-base font-bold">{selected.name}</h2>
        <code className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">/{activeDraft.slug}</code>
      </div>
      <div className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1.5 text-sm font-medium">Title <span className="text-destructive">*</span>
            <Input value={activeDraft.title} onChange={(event) => update({ title: event.target.value })} />
          </label>
          <label className="space-y-1.5 text-sm font-medium">Slug <span className="text-destructive">*</span>
            <Input value={activeDraft.slug} onChange={(event) => update({ slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} />
          </label>
          <label className="space-y-1.5 text-sm font-medium">Version <span className="text-destructive">*</span>
            <Input value={activeDraft.version} onChange={(event) => update({ version: event.target.value })} />
          </label>
        </div>
        <div className="space-y-1.5 text-sm font-medium">Content <span className="text-destructive">*</span>
          <RichTextEditor key={selected.id} value={activeDraft.content} onChange={(html) => update({ content: html })} />
        </div>
        <p className="text-xs text-muted-foreground">Headings, bold, italics and lists are carried through to the public page exactly as shown here.</p>
        <label className="flex items-center gap-2 text-sm font-medium">
          <Checkbox checked={activeDraft.published} onCheckedChange={(value) => update({ published: value === true })} />
          Published — visible on the public site
        </label>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-3.5">
        <ConfirmDeleteDialog itemType="legal page" name={selected.name} onConfirm={() => { onDelete(selected); const next = pages.find((page) => page.id !== selected.id); setSelectedId(next?.id ?? ""); setDraft(next ?? null); }}>
          <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" />Delete page</Button>
        </ConfirmDeleteDialog>
        <Button variant="outline" disabled={!dirty} onClick={() => setDraft(selected)}>Cancel</Button>
        <ConfirmSaveDialog
          title={`Save ${selected.name}?`}
          disabled={!dirty || !valid}
          summary={[{ label: "Title", value: activeDraft.title }, { label: "Slug", value: `/${activeDraft.slug}` }, { label: "Version", value: activeDraft.version }, { label: "Visibility", value: activeDraft.published ? "Published — public" : "Unpublished — hidden" }]}
          onConfirm={() => onSave(activeDraft)}
        >
          <Button disabled={!dirty || !valid}><Check className="h-4 w-4" />Save</Button>
        </ConfirmSaveDialog>
      </div>
    </section>
  </div>;
}
