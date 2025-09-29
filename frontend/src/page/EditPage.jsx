// EditPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { exiosInstance } from "../lib/axios";

const EditPage = () => {
  const { id } = useParams(); // URL se problem id
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "EASY",
    tags: [],
    examples: "",
    constraints: "",
    testcases: [],
    codeSnippets: {},
    referenceSolutions: {}, // {javascript: "code here"}
  });

  // ✅ Problem fetch karna
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res=await exiosInstance.get(`/problems/get-problem/${id}`,{ withCredentials: true });

        const problem = res.data?.problem;
        if (!problem) {
          setError("Problem not found");
          setLoading(false);
          return;
        }

        setFormData(problem);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load problem");
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  // ✅ Input handle
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      tags: e.target.value.split(",").map((tag) => tag.trim()),
    }));
  };

  // ✅ Submit Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await exiosInstance.put(
        `/problems/update-problem/${id}`,
        formData,
        { withCredentials: true }
      );
      alert("Problem updated successfully!");
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.error || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading problem...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="w-full mx-auto p-6 shadow rounded bg-base-200 mt-8">
      <h2 className="text-2xl font-bold mb-4">Edit Problem</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="font-semibold block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="font-semibold block mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            rows={4}
            required
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className="font-semibold block mb-1">Difficulty</label>
          <select
            name="difficulty"
            value={formData.difficulty || "EASY"}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="font-semibold block mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={(formData.tags || []).join(", ")}
            onChange={handleTagsChange}
            className="input input-bordered w-full"
          />
        </div>

        {/* Examples */}
        <div>
          <label className="font-semibold block mb-1">Examples</label>
          <textarea
            name="examples"
            value={formData.examples || ""}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
          />
        </div>

        {/* Constraints */}
        <div>
          <label className="font-semibold block mb-1">Constraints</label>
          <textarea
            name="constraints"
            value={formData.constraints || ""}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
          />
        </div>

        {/* Code Snippets */}
        <div>
          <label className="font-semibold block mb-1">Code Snippets (JSON)</label>
          <textarea
            name="codeSnippets"
            value={JSON.stringify(formData.codeSnippets || {}, null, 2)}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                codeSnippets: JSON.parse(e.target.value || "{}"),
              }))
            }
            className="textarea textarea-bordered w-full"
            rows={4}
          />
        </div>

        {/* Reference Solutions */}
        <div>
          <label className="font-semibold block mb-1">
            Reference Solutions (JSON)
          </label>
          <textarea
            name="referenceSolutions"
            value={JSON.stringify(formData.referenceSolutions || {}, null, 2)}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                referenceSolutions: JSON.parse(e.target.value || "{}"),
              }))
            }
            className="textarea textarea-bordered w-full"
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={saving}
        >
          {saving ? "Updating..." : "Update Problem"}
        </button>
      </form>
    </div>
  );
};

export default EditPage;
