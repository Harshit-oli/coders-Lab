// EditPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { exiosInstance } from "../lib/axios";

const EditPage = () => {
  const { id } = useParams();
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
    referenceSolutions: {},
  });

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await exiosInstance.get(
          `/problems/get-problem/${id}`,
          { withCredentials: true }
        );

        const problem = res.data?.problem;
        if (!problem) {
          setError("Problem not found");
          setLoading(false);
          return;
        }

        setFormData(problem);
        setLoading(false);
      } catch (err) {
        setError("Failed to load problem");
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

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
      alert(err.response?.data?.error || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center mt-10 text-primary">Loading problem...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="bg-base-200 shadow-xl rounded-xl p-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
          Edit Problem
        </h2>

        {/* 🟩 FORM START */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* GRID: Mobile = single column, Tablet = 2 columns, Laptop = 2 columns wide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Title */}
            <div className="md:col-span-2">
              <label className="font-semibold text-secondary mb-1 block">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="font-semibold text-secondary mb-1 block">
                Difficulty
              </label>
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
              <label className="font-semibold text-secondary mb-1 block">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={(formData.tags || []).join(", ")}
                onChange={handleTagsChange}
                className="input input-bordered w-full"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="font-semibold text-secondary mb-1 block">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={4}
                required
              />
            </div>

            {/* Examples */}
            <div className="md:col-span-2">
              <label className="font-semibold text-secondary mb-1 block">
                Examples
              </label>
              <textarea
                name="examples"
                value={formData.examples || ""}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={4}
              />
            </div>

            {/* Constraints */}
            <div className="md:col-span-2">
              <label className="font-semibold text-secondary mb-1 block">
                Constraints
              </label>
              <textarea
                name="constraints"
                value={formData.constraints || ""}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={4}
              />
            </div>

            {/* Code Snippets */}
            <div className="md:col-span-2 bg-base-100 p-4 rounded-xl shadow">
              <label className="font-semibold text-accent mb-1 block">
                Code Snippets (JSON)
              </label>
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
                rows={6}
              />
            </div>

            {/* Reference Solutions */}
            <div className="md:col-span-2 bg-base-100 p-4 rounded-xl shadow">
              <label className="font-semibold text-accent mb-1 block">
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
                rows={6}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full text-lg"
            disabled={saving}
          >
            {saving ? "Updating..." : "Update Problem"}
          </button>
        </form>
        {/* 🟥 FORM END */}
      </div>
    </div>
  );
};

export default EditPage;
