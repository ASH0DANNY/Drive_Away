"use client";

import * as React from "react";
import { useFieldArray, type Control, type FieldValues, type ArrayPath, type UseFormRegister } from "react-hook-form";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type FieldConfig = {
  name: string;
  label: string;
  type?: "input" | "textarea";
};

export function RepeatingListEditor<T extends FieldValues>({
  control,
  register,
  name,
  fields,
  newItem,
  itemLabel = "item",
  minItems = 0,
}: {
  control: Control<T>;
  register: UseFormRegister<T>;
  name: ArrayPath<T>;
  fields: FieldConfig[];
  newItem: Record<string, unknown>;
  itemLabel?: string;
  minItems?: number;
}) {
  const { fields: items, append, remove } = useFieldArray({ control, name });

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item.id} className="rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <GripVertical className="size-3.5" /> {itemLabel} {index + 1}
            </span>
            {items.length > minItems && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Remove ${itemLabel} ${index + 1}`}
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                <Label className="text-xs text-muted-foreground">{f.label}</Label>
                {f.type === "textarea" ? (
                  <Textarea className="mt-1" {...register(`${name}.${index}.${f.name}` as never)} />
                ) : (
                  <Input className="mt-1" {...register(`${name}.${index}.${f.name}` as never)} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={() => append(newItem as never)}>
        <Plus className="size-3.5" /> Add {itemLabel}
      </Button>
    </div>
  );
}
