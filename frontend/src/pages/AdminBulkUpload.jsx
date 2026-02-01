import { useState } from "react";
import api from "../api";

export default function AdminBulkUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!file) return alert("JSON file select karo ❌");

    try {
      setLoading(true);

      const text = await file.text();
      const data = JSON.parse(text);

      const res = await api.post("/api/admin/questions/bulk", data);

      alert(`Upload success ✅ (${res.data.insertedCount} questions)`);
    } catch (err) {
      alert("Upload failed ❌ (JSON format check karo)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Bulk Question Upload</h1>

        <input
          type="file"
          accept=".json"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        <button
          onClick={upload}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-xl font-semibold"
        >
          {loading ? "Uploading..." : "Upload JSON"}
        </button>
      </div>
    </div>
  );
}
