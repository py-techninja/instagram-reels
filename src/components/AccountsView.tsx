import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function AccountsView() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    account_name: "",
    headers: "",
    body_template: "",
    status: "active",
    cooldown_seconds: 0,
  });

  /* =====================
     FETCH
  ====================== */
  const fetchAccounts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("instagram_accounts")
      .select("*")
      .order("created_at", { ascending: false });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    setAccounts(data || []);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  /* =====================
     SAVE (CREATE / UPDATE)
  ====================== */
  const saveAccount = async () => {
    setError("");

    let parsedHeaders;
    try {
      parsedHeaders = JSON.parse(form.headers);
    } catch {
      setError("Headers must be valid JSON");
      return;
    }

    const payload = {
      account_name: form.account_name,
      headers: form.headers,
      body_template: form.body_template,
      status: form.status,
      cooldown_seconds: Number(form.cooldown_seconds),
    };

    const query = editingId
      ? supabase.from("instagram_accounts").update(payload).eq("id", editingId)
      : supabase.from("instagram_accounts").insert(payload);

    const { error } = await query;
    if (error) {
      setError(error.message);
      return;
    }

    resetForm();
    fetchAccounts();
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      account_name: "",
      headers: "",
      body_template: "",
      status: "active",
      cooldown_seconds: 0,
    });
  };

  /* =====================
     EDIT
  ====================== */
  const editAccount = (acc: any) => {
    setEditingId(acc.id);
    setForm({
      account_name: acc.account_name,
      headers: acc.headers,
      body_template: acc.body_template || "",
      status: acc.status,
      cooldown_seconds: acc.cooldown_seconds || 0,
    });
  };

  /* =====================
     DELETE
  ====================== */
  const deleteAccount = async (id: string) => {
    if (!confirm("Delete this account?")) return;
    await supabase.from("instagram_accounts").delete().eq("id", id);
    fetchAccounts();
  };

  /* =====================
     UI
  ====================== */
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Instagram Accounts</h1>

        {/* FORM */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="font-semibold mb-4">
            {editingId ? "Edit Account" : "Add Account"}
          </h2>

          <input
            className="w-full border p-3 rounded mb-3"
            placeholder="Account Name"
            value={form.account_name}
            onChange={(e) =>
              setForm({ ...form, account_name: e.target.value })
            }
          />

          <textarea
            className="w-full border p-3 rounded mb-3 font-mono text-sm"
            rows={6}
            placeholder="Headers (JSON)"
            value={form.headers}
            onChange={(e) =>
              setForm({ ...form, headers: e.target.value })
            }
          />

          <textarea
            className="w-full border p-3 rounded mb-3 font-mono text-sm"
            rows={4}
            placeholder="Body Template (raw, saved as-is)"
            value={form.body_template}
            onChange={(e) =>
              setForm({ ...form, body_template: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <select
              className="border p-3 rounded"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <input
              type="number"
              className="border p-3 rounded"
              placeholder="Cooldown (seconds)"
              value={form.cooldown_seconds}
              onChange={(e) =>
                setForm({ ...form, cooldown_seconds: e.target.value })
              }
            />
          </div>

          {error && <p className="text-red-600 mb-3">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={saveAccount}
              className="px-6 py-2 bg-blue-600 text-white rounded"
            >
              {editingId ? "Update Account" : "Add Account"}
            </button>

            {editingId && (
              <button
                onClick={resetForm}
                className="px-6 py-2 border rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="p-3 text-left">Account</th>
                <th className="p-3">Status</th>
                <th className="p-3">Cooldown</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => (
                <tr key={acc.id} className="border-b">
                  <td className="p-3">{acc.account_name}</td>
                  <td className="p-3 text-center">
                    {acc.status === "active" ? "🟢" : "🔴"}
                  </td>
                  <td className="p-3 text-center">
                    {acc.cooldown_seconds}s
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => editAccount(acc)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteAccount(acc.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {!accounts.length && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500">
                    No accounts yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
