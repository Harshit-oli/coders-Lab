import React, { useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import {
  Bookmark,
  PencilIcon,
  TrashIcon,
  Plus,
  Loader2,
  MoreVertical,
} from "lucide-react";
import { useActions } from "../store/useAction";
import { usePlaylistStore } from "../store/usePlaylistStore";
import CreatePlaylistModel from "./CreatePlaylistModel";
import AddToPlaylist from "./AddToPlaylist";

const ProblemTable = ({ problems }) => {
  const { authUser } = useAuthStore();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModelOpen, setIsAddToPlaylistModelOpen] =
    useState(false);

  // NEW: Drop-down menu state for mobile
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const { createPlaylist } = usePlaylistStore();
  const { isDeletingProblem, onDeleteProblem } = useActions();
  const navigate = useNavigate();

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((problem) =>
        difficulty === "ALL" ? true : problem.difficulty === difficulty
      )
      .filter((problem) =>
        selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag)
      );
  }, [problems, search, difficulty, selectedTag]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);

  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProblems, currentPage]);

  const difficulties = ["EASY", "MEDIUM", "HARD"];

  const handleDelete = (id) => {
    onDeleteProblem(id);
  };

  const handleAddToPlaylist = (problemId) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModelOpen(true);
  };

  const handleCreatePlaylist = async (data) => {
    await createPlaylist(data);
  };

  return (
    <div className="w-[90%] max-w-6xl md:mx-auto mt-10">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="font-bold text-2xl ">Problems</h2>
        <button
          className="btn btn-primary gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-2 h-2 md:w-4 h-4" />
          Create Playlist
        </button>
      </div>

      {/* Filters */}
      <div className="md:flex flex-wrap mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by title"
          className="input input-bordered w-full md:w-1/3 bg-base-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="select select-bordered bg-base-200"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="ALL">All Difficulties</option>
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>
              {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered bg-base-200"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="ALL">All Tags</option>
          {allTags.map((tag) => (
            <option key={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-md">
        <table className="table table-zebra table-lg bg-base-200 text-base-content">
          <thead className="bg-base-200">
            <tr>
              <th>Solved</th>
              <th>Title</th>
              <th className="hidden lg:table-cell">Tags</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProblems.length > 0 ? (
              paginatedProblems.map((problem) => {
                const isSolved = problem.solvedBy.some(
                  (user) => user.userId === authUser?.id
                );

                return (
                  <tr key={problem.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSolved}
                        readOnly
                        className="ml-2 checkbox checkbox-sm"
                      />
                    </td>

                    <td>
                      <Link
                        to={`/problem/${problem.id}`}
                        className="font-semibold hover:underline"
                      >
                        {problem.title}
                      </Link>
                    </td>

                    <td  className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(problem.tags || []).map((tag, idx) => (
                          <span
                            key={idx}
                            className="badge badge-outline badge-warning text-xs font-bold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`badge font-semibold text-xs text-white ${
                          problem.difficulty === "EASY"
                            ? "badge-success"
                            : problem.difficulty === "MEDIUM"
                            ? "badge-warning"
                            : "badge-error"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>

                    {/* ===== ACTIONS COLUMN ===== */}
                    <td>
                      {/* Desktop Actions */}
                      <div className="hidden md:flex flex-row gap-2 items-center">
                        {authUser?.role === "ADMIN" && (
                          <>
                            <button
                              onClick={() => handleDelete(problem.id)}
                              className="btn btn-sm btn-error"
                            >
                              {isDeletingProblem ? (
                                <Loader2 className="animate-spin h-4 w-4" />
                              ) : (
                                <TrashIcon className="w-4 h-4 text-white" />
                              )}
                            </button>

                            <button
                              onClick={() =>
                                navigate(`/problems/${problem.id}/edit`)
                              }
                              className="btn btn-sm btn-warning"
                            >
                              <PencilIcon className="w-4 h-4 text-white" />
                            </button>
                          </>
                        )}

                        <button
                          className="btn btn-sm btn-outline flex gap-2 items-center"
                          onClick={() => handleAddToPlaylist(problem.id)}
                        >
                          <Bookmark className="w-4 h-4" />
                          <span className="hidden sm:inline">Save</span>
                        </button>
                      </div>

                      {/* Mobile Dropdown */}
                      <div className="md:hidden relative">
                        <button
                          onClick={() => toggleMenu(problem.id)}
                          className="p-2 rounded bg-base-300"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {openMenuId === problem.id && (
                          <div className="absolute right-2 top-10 bg-base-100 w-40 p-2 shadow-lg rounded-lg flex flex-col z-10">
                            {authUser?.role === "ADMIN" && (
                              <>
                                <button
                                  onClick={() => handleDelete(problem.id)}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-base-200 text-red-600"
                                >
                                  <TrashIcon size={14} /> Delete
                                </button>

                                <button
                                  onClick={() =>
                                    navigate(`/problems/${problem.id}/edit`)
                                  }
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-base-200"
                                >
                                  <PencilIcon size={14} /> Edit
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => handleAddToPlaylist(problem.id)}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-base-200"
                            >
                              <Bookmark size={14} /> Save to Playlist
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No Problem found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          className="btn btn-sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </button>

        <span className="btn btn-ghost btn-sm">
          {currentPage}/{totalPages}
        </span>

        <button
          className="btn btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      {/* Modals */}
      <CreatePlaylistModel
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />

      <AddToPlaylist
        isOpen={isAddToPlaylistModelOpen}
        onClose={() => setIsAddToPlaylistModelOpen(false)}
        problemId={selectedProblemId}
      />
    </div>
  );
};

export default ProblemTable;
