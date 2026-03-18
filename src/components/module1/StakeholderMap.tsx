"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { Stakeholder } from "@/db/schema";

interface Props {
  startupId: string;
  stakeholders: Stakeholder[];
  onUpdate: () => void;
}

interface AddFormState {
  name: string;
  role: string;
  priority: "critique" | "important" | "secondaire";
}

const emptyForm: AddFormState = { name: "", role: "", priority: "secondaire" };

export function StakeholderMap({ startupId, stakeholders, onUpdate }: Props) {
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [form, setForm] = useState<AddFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<AddFormState>(emptyForm);

  async function handleAdd(category: string) {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await fetch(`/api/startups/${startupId}/stakeholders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, category }),
      });
      setForm(emptyForm);
      setAddingTo(null);
      onUpdate();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(stakeholderId: string) {
    try {
      await fetch(`/api/startups/${startupId}/stakeholders/${stakeholderId}`, {
        method: "DELETE",
      });
      onUpdate();
    } catch {
      // ignore
    }
  }

  async function handleEditSave(stakeholderId: string) {
    if (!editForm.name.trim()) return;
    setSaving(true);
    try {
      await fetch(`/api/startups/${startupId}/stakeholders/${stakeholderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      setEditingId(null);
      onUpdate();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  function startEdit(s: Stakeholder) {
    setEditingId(s.id);
    setEditForm({ name: s.name, role: s.role, priority: s.priority });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {CATEGORIES.map((cat) => {
        const catStakeholders = stakeholders.filter((s) => s.category === cat.id);

        return (
          <div
            key={cat.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <div className="bg-brand-blue-500/5 px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">{cat.icon}</span>
                <div>
                  <h3 className="font-semibold text-brand-blue-700 text-sm">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-gray-500">{cat.description}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400 mt-1 block">
                {catStakeholders.length} partie{catStakeholders.length !== 1 ? "s" : ""} prenante{catStakeholders.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="p-3 space-y-2 min-h-[120px]">
              {catStakeholders.map((s) => (
                <div key={s.id}>
                  {editingId === s.id ? (
                    <div className="border border-brand-coral-300 rounded-lg p-3 space-y-2 bg-brand-coral-500/5">
                      <Input
                        placeholder="Nom / Entité"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                      <Input
                        placeholder="Rôle / Fonction"
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      />
                      <Select
                        options={[
                          { value: "critique", label: "Critique" },
                          { value: "important", label: "Important" },
                          { value: "secondaire", label: "Secondaire" },
                        ]}
                        value={editForm.priority}
                        onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as AddFormState["priority"] })}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleEditSave(s.id)} disabled={saving}>
                          Sauver
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="group border border-gray-100 rounded-lg p-3 hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-brand-blue-700 text-sm truncate">
                            {s.name}
                          </p>
                          {s.role && (
                            <p className="text-xs text-gray-500 truncate">{s.role}</p>
                          )}
                        </div>
                        <Badge priority={s.priority} />
                      </div>
                      <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(s)}
                          className="text-xs text-brand-blue-500 hover:underline"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {addingTo === cat.id ? (
                <div className="border-2 border-dashed border-brand-coral-300 rounded-lg p-3 space-y-2">
                  <Input
                    placeholder="Nom / Entité"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    autoFocus
                  />
                  <Input
                    placeholder="Rôle / Fonction"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  />
                  <Select
                    options={[
                      { value: "critique", label: "Critique" },
                      { value: "important", label: "Important" },
                      { value: "secondaire", label: "Secondaire" },
                    ]}
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as AddFormState["priority"] })}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAdd(cat.id)}
                      disabled={saving || !form.name.trim()}
                    >
                      Ajouter
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setAddingTo(null);
                        setForm(emptyForm);
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAddingTo(cat.id);
                    setForm(emptyForm);
                  }}
                  className="w-full border-2 border-dashed border-gray-200 rounded-lg p-3 text-sm text-gray-400 hover:border-brand-coral-300 hover:text-brand-coral-500 transition-colors"
                >
                  + Ajouter
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
