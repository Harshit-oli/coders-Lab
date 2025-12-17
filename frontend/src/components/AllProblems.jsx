import React, {useState, useMemo} from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link } from 'react-router-dom'
import { Bookmark, PencilIcon, TrashIcon, Plus, Loader2, MoreVertical } from 'lucide-react'
import { useActions } from '../store/useAction'
import { useNavigate } from 'react-router-dom'
import { usePlaylistStore } from '../store/usePlaylistStore'
import CreatePlaylistModel from './CreatePlaylistModel'
import AddToPlaylist from './AddToPlaylist'

const AllProblems = ({problems}) => {
  
  const {authUser} = useAuthStore();
  const [search,setSearch] = useState("");
  const [difficulty,setDifficulty] = useState("ALL");
  const [selectedTag,setSelectedTag] = useState("ALL");
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [isCreateModalOpen,setIsCreateModalOpen]=useState(false);
  const [isAddToPlaylistModelOpen,setIsAddToPlaylistModelOpen]=useState(false);
  const {createPlaylist}=usePlaylistStore();
  const {isDeletingProblem,onDeleteProblem}=useActions();
  const navigate=useNavigate();

  // Mobile menu state
  const [openMenuId, setOpenMenuId] = useState(null);
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const allTags = useMemo(() => {
    if(!Array.isArray(problems)) return [];
    const tagSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => difficulty === "ALL" ? true : p.difficulty === difficulty)
      .filter((p) => selectedTag === "ALL" ? true : p.tags?.includes(selectedTag));
  }, [problems, search, difficulty, selectedTag]);

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

  const difficulties = ["EASY","MEDIUM","HARD"];


  return (
    <div className="w-full max-w-6xl md:mx-auto mt-10 ">

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="ml-10 font-bold text-2xl">Problems</h2>

        <button
          className="btn btn-primary gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-2 h-2 md:w-4 h-4" />
          Create Playlist
        </button>
      </div>


      {/* FILTERS */}
      <div className="ml-10 md:flex flex-wrap gap-4 mb-6">
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
          {difficulties.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          className="select select-bordered bg-base-200"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="ALL">All Tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>


      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl shadow-md ml-1">
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
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem) => {
                const isSolved = problem.solvedBy.some(
                  (u) => u.userId === authUser?.id
                );

                return (
                  <tr key={problem.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSolved}
                        readOnly
                        className=" ml-2 checkbox checkbox-sm"
                      />
                    </td>

                    <td>
                      <Link to={`/problem/${problem.id}`} className="font-semibold hover:underline">
                        {problem.title}
                      </Link>
                    </td>

                    <td className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {problem.tags?.map((tag, idx) => (
                          <span key={idx} className="badge badge-outline badge-warning text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`badge text-xs font-semibold text-white ${
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


                    {/* ACTIONS */}
                    <td className="relative">

                      {/* DESKTOP ACTIONS */}
                      <div className="hidden md:flex gap-2 items-center">

                        {authUser?.role === "ADMIN" && (
                          <>
                            <button
                              onClick={() => handleDelete(problem.id)}
                              className="btn btn-sm btn-error"
                            >
                              {isDeletingProblem
                                ? <Loader2 className="animate-spin h-4 w-4" />
                                : <TrashIcon className="w-4 h-4 text-white" />}
                            </button>

                            <button
                              onClick={() => navigate(`/problems/${problem.id}/edit`)}
                              className="btn btn-sm btn-warning"
                            >
                              <PencilIcon className="w-4 h-4 text-white" />
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => handleAddToPlaylist(problem.id)}
                          className="btn btn-sm btn-outline gap-2"
                        >
                          <Bookmark className="w-4 h-4" />
                          Save
                        </button>
                      </div>


                      {/* MOBILE ACTION DROPDOWN */}
                      <div className="md:hidden relative">
                        <button
                          onClick={() => toggleMenu(problem.id)}
                          className="p-2 rounded bg-base-300"
                        >
                          <MoreVertical size={15} />
                        </button>

                        {openMenuId === problem.id && (
                          <div className="absolute right-2 top-10 bg-base-100 w-40 p-2 shadow-lg rounded-lg flex flex-col z-10">

                            {authUser?.role === "ADMIN" && (
                              <>
                                <button
                                  onClick={() => handleDelete(problem.id)}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-base-200 text-red-600"
                                >
                                  <TrashIcon size={10} /> Delete
                                </button>

                                <button
                                  onClick={() => navigate(`/problems/${problem.id}/edit`)}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-base-200"
                                >
                                  <PencilIcon size={10} /> Edit
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => handleAddToPlaylist(problem.id)}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-base-200"
                            >
                              <Bookmark size={10} /> Save to Playlist
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

export default AllProblems;
