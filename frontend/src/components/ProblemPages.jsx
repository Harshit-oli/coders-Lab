import React, { useEffect } from "react";
import { useProblemStore } from "../store/useProblemStore";
import { Loader } from "lucide-react";
import AllProblems from "./AllProblems";


const ProblemsPages = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    if (problems.length === 0) { // already loaded to avoid extra API call
      getAllProblems();
    }
  }, [getAllProblems, problems]);

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center mt-14 px-4">
      <h1 className="text-3xl font-bold mb-6">All Problems</h1>
      {problems.length > 0 ? (
        <AllProblems problems={problems} />
      ) : (
        <p>No problems found</p>
      )}
    </div>
  );
};

export default ProblemsPages;
