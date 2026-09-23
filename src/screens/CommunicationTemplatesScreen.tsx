import { CopyButton } from "@/components/admin/CopyButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { tabTriggerClass } from "@/lib/admin-utils";
import { cn } from "@/lib/utils";
import type { CommunicationTemplate, TemplateChannel, TemplateCopy } from "@/types/admin";
import { Bell, Check, Download, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CommunicationTemplates({
  templates,
  onChange,
  templateChannels,
}: {
  templates: CommunicationTemplate[];
  onChange: (template: CommunicationTemplate) => void;
  templateChannels: TemplateChannel[];
}) {
  const [selectedId, setSelectedId] = useState(templates[0]?.id ?? "");
  const [channel, setChannel] = useState<TemplateChannel>("Email");
  const selected = templates.find((template) => template.id === selectedId) ?? templates[0];
  const channelMeta: Record<TemplateChannel, { icon: React.ElementType; description: string }> = {
    Email: { icon: Mail, description: "Long-form subject and body copy for inbox delivery." },
    SMS: {
      icon: MessageSquare,
      description: "Short transactional text optimised for quick reading.",
    },
    WhatsApp: {
      icon: MessageSquare,
      description: "Conversational copy used by the WhatsApp sender.",
    },
    Notification: { icon: Bell, description: "In-app and push notification title and body." },
  };
  if (!selected) return null;
  const save = () =>
    toast.success("Template saved", {
      description: `${selected.name} · ${channel} copy was updated.`,
    });
  return (
    <>
      <PageHeader
        title="Communication Templates"
        description="Manage event-based customer copy by template and channel without scanning four separate cards at once."
        actions={
          <Button variant="outline">
            <Download />
            Export templates
          </Button>
        }
      />
      <section className="mb-5 rounded-lg border border-border bg-card p-4 shadow-card">
        <div className="grid gap-4 lg:grid-cols-[minmax(280px,420px)_1fr] lg:items-start">
          <label className="space-y-1.5 text-sm font-medium">
            Template name
            <Select
              value={selected.id}
              onValueChange={(value) => {
                setSelectedId(value);
                setChannel("Email");
              }}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <div className="rounded-lg border border-border bg-muted/40 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold text-muted-foreground">
                {selected.event}
              </span>
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                {selected.trigger}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{selected.description}</p>
          </div>
        </div>
        <div className="mt-4 border-t border-border pt-4">
          <div className="mb-2 text-xs font-bold uppercase text-muted-foreground">
            Available variables
          </div>
          {selected.variables.length ? (
            <div className="flex flex-wrap gap-2">
              {selected.variables.map((variable) => (
                <span
                  key={variable}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 font-mono text-xs font-semibold text-foreground shadow-card"
                >
                  {variable}
                  <CopyButton value={variable} />
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No variables — nothing fires this event yet.
            </p>
          )}
        </div>
      </section>
      <Tabs value={channel} onValueChange={(value) => setChannel(value as TemplateChannel)}>
        <TabsList className="mb-5 h-auto w-full justify-start gap-6 overflow-x-auto rounded-none border-b border-border bg-transparent p-0">
          {templateChannels.map((item) => {
            const Icon = channelMeta[item].icon;
            const copy = selected.channels[item];
            return (
              <TabsTrigger key={item} value={item} className={tabTriggerClass}>
                <span className="inline-flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {item}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                      copy.enabled
                        ? "bg-success-soft text-success"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {copy.enabled ? "On" : "Off"}
                  </span>
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        {templateChannels.map((item) => {
          const Icon = channelMeta[item].icon;
          const itemCopy = selected.channels[item];
          const updateItemCopy = <K extends keyof TemplateCopy>(key: K, value: TemplateCopy[K]) =>
            onChange({
              ...selected,
              channels: { ...selected.channels, [item]: { ...itemCopy, [key]: value } },
            });
          return (
            <TabsContent key={item} value={item} className="mt-0">
              <section className="rounded-lg border border-border bg-card shadow-card">
                <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <h2 className="font-heading text-base font-bold">{item} copy</h2>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {channelMeta[item].description}
                    </p>
                  </div>
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <Switch
                      checked={itemCopy.enabled}
                      onCheckedChange={(checked) => updateItemCopy("enabled", checked)}
                      aria-label={`${item} enabled`}
                    />
                    Enabled
                  </label>
                </div>
                <div className="grid gap-5 p-5">
                  {(item === "Email" || item === "Notification") && (
                    <label className="space-y-1.5 text-sm font-medium">
                      {item === "Email" ? "Subject" : "Title"}
                      <Input
                        value={itemCopy.subject ?? ""}
                        onChange={(event) => updateItemCopy("subject", event.target.value)}
                        placeholder={item === "Email" ? "Email subject" : "Notification title"}
                      />
                    </label>
                  )}
                  <label className="space-y-1.5 text-sm font-medium">
                    Body template
                    <Textarea
                      className="min-h-48 leading-6"
                      value={itemCopy.body}
                      onChange={(event) => updateItemCopy("body", event.target.value)}
                      placeholder="Write copy using the variables above…"
                    />
                  </label>
                  <div className="rounded-lg border border-border bg-muted/40 p-4">
                    <div className="mb-2 text-xs font-bold uppercase text-muted-foreground">
                      Preview
                    </div>
                    {itemCopy.subject && (
                      <p className="font-heading text-base font-bold">{itemCopy.subject}</p>
                    )}
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">
                      {itemCopy.body}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
                  <Button
                    variant="destructiveSoft"
                    onClick={() =>
                      toast.info("Changes kept on screen", {
                        description: "No live dispatch settings were changed in this playground.",
                      })
                    }
                  >
                    Cancel
                  </Button>
                  <Button onClick={save}>
                    <Check />
                    Save
                  </Button>
                </div>
              </section>
            </TabsContent>
          );
        })}
      </Tabs>
    </>
  );
}
