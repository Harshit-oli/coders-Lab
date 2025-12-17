import React, { useEffect } from "react";
import { useProblemStore } from "../store/useProblemStore";
import { Loader } from "lucide-react";
import AllProblems from "./AllProblems";

const ProblemsPages = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    if (problems.length === 0) { 
      getAllProblems();
    }
  }, [getAllProblems, problems]);

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen 
        flex flex-col items-center 
        mt-14 
        px-4 sm:px-6 md:px-10 lg:px-16 
        w-full
      "
    >
      <h1
        className="
          text-2xl sm:text-3xl md:text-4xl font-bold mb-6 
          text-center
        "
      >
        All Problems
      </h1>

      <div className="w-full max-w-7xl">
        {problems.length > 0 ? (
          <AllProblems problems={problems} />
        ) : (
          <p className="text-center text-gray-600 text-sm sm:text-base">
            No problems found
          </p>
        )}
      </div>
    </div>
  );
};

export default ProblemsPages;


