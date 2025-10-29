"use client";

import React from "react";
import {
  FunctionClassificationTable as FunctionTableType,
  FinalRating,
  RatingRule,
} from "@/lib/types";
import { FINAL_RATINGS } from "@/lib/constants";
import { calculateRatingWithRules } from "@/lib/utils";

interface FinalRatingsVisualizationProps {
  functionTables: FunctionTableType[];
  ratingRules: RatingRule[];
}

const getRatingColor = (rating: FinalRating): string => {
  switch (rating) {
    case "AAA":
      return "text-green-600";
    case "AA":
      return "text-green-500";
    case "A":
      return "text-green-400";
    case "BBB":
      return "text-yellow-500";
    case "BB":
      return "text-yellow-600";
    case "B":
      return "text-orange-500";
    case "CCC":
      return "text-orange-600";
    case "CC":
      return "text-orange-700";
    case "C":
      return "text-red-500";
    case "D":
      return "text-red-700";
    default:
      return "text-gray-600";
  }
};

export function FinalRatingsVisualization({
  functionTables,
  ratingRules,
}: FinalRatingsVisualizationProps) {
  const allEntries = functionTables.flatMap((table) => table.entries);

  // Calculate the final rating based on worst case
  const finalRating = calculateRatingWithRules(allEntries, ratingRules);
  const ratingInfo = FINAL_RATINGS.find((r) => r.rating === finalRating);

  const ratings: FinalRating[] = [
    "AAA",
    "AA",
    "A",
    "BBB",
    "BB",
    "B",
    "CCC",
    "CC",
    "C",
    "D",
  ];
  const currentRatingIndex = ratings.indexOf(finalRating);
  const position = (currentRatingIndex / (ratings.length - 1)) * 100;

  // Calculate per-project ratings
  const projectRatings = functionTables.map((table) => ({
    name: table.title || "Untitled Project",
    rating: calculateRatingWithRules(table.entries, ratingRules),
  }));

  // Group projects by rating
  const projectsByRating = projectRatings.reduce(
    (acc, project) => {
      if (!acc[project.rating]) {
        acc[project.rating] = [];
      }
      acc[project.rating].push(project);
      return acc;
    },
    {} as Record<FinalRating, typeof projectRatings>
  );

  return (
    <div className="border rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">Final Risk Rating</h2>

      {/* Rating Scale Visualization */}
      <div className="mb-8">
        <p className="text-sm font-semibold mb-4">Risk Scale</p>

        {/* Main Risk Scale with Project Markers */}
        <div className="relative -mx-6 -mb-6">
          {/* Project names and connecting lines above the scale */}
          {projectRatings.length > 0 && (
            <div className="relative mb-0">
              {(() => {
                // Calculate max number of projects in any group for vertical spacing
                const maxProjectsInGroup = Math.max(
                  ...Object.values(projectsByRating).map((p) => p.length)
                );
                const rowHeight = 22; // Height per project row
                const totalHeight = maxProjectsInGroup * rowHeight + 40; // Projects + rating + line

                return (
                  <div style={{ height: `${totalHeight}px`, position: "relative" }}>
                    {Object.entries(projectsByRating).map(([rating, projects]) => {
                      const projectRatingIndex = ratings.indexOf(rating as FinalRating);
                      const projectPosition =
                        (projectRatingIndex / (ratings.length - 1)) * 100;

                      const finalProjectPosition =
                        projectPosition > 50
                          ? projectPosition - 2
                          : projectPosition + 3;

                      // Calculate how many empty rows are above this group
                      const emptyRowsAbove = maxProjectsInGroup - projects.length;
                      const topOffset = emptyRowsAbove * rowHeight;

                      return (
                        <div
                          key={rating}
                          className="absolute flex flex-col items-center"
                          style={{
                            left: `${finalProjectPosition}%`,
                            transform: "translateX(-50%)",
                            top: `${topOffset}px`,
                          }}
                        >
                          {/* Container for vertically stacked projects */}
                          <div className="flex flex-col items-center gap-0">
                            {projects.map((project, groupIdx) => (
                              <div
                                key={`${rating}-${groupIdx}`}
                                className="text-xs font-semibold whitespace-nowrap text-center"
                                style={{ height: `${rowHeight}px`, display: "flex", alignItems: "center" }}
                              >
                                <span className="truncate w-16">{project.name}</span>
                              </div>
                            ))}
                          </div>

                          {/* Rating shown once below all projects */}
                          <span
                            className={`${getRatingColor(
                              rating as FinalRating
                            )} font-bold text-xs`}
                          >
                            {rating}
                          </span>

                          {/* Single vertical connecting line for the group */}
                          <div className="w-px bg-gray-400 dark:bg-gray-500 mt-1" style={{ height: "24px" }} />
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Main Risk Scale Bar - Full Width */}
          <div className="relative bg-gradient-to-r from-green-100 via-yellow-100 to-red-100 dark:from-green-900 dark:via-yellow-900 dark:to-red-900 border-2 border-gray-300 dark:border-gray-600">
            {/* Rating labels */}
            <div className="flex justify-between items-center text-xs font-bold px-6 py-2">
              <span className="text-green-800 dark:text-green-200">AAA</span>
              <span className="text-green-700 dark:text-green-300">AA</span>
              <span className="text-green-600 dark:text-green-400">A</span>
              <span className="text-yellow-600 dark:text-yellow-300">BBB</span>
              <span className="text-yellow-700 dark:text-yellow-400">BB</span>
              <span className="text-yellow-800 dark:text-yellow-500">B</span>
              <span className="text-orange-600 dark:text-orange-300">CCC</span>
              <span className="text-orange-700 dark:text-orange-400">CC</span>
              <span className="text-orange-800 dark:text-orange-500">C</span>
              <span className="text-red-800 dark:text-red-300">D</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 text-xs pt-8">
        <div>
          <p className="font-semibold mb-2">Rating Scale:</p>
          <ul className="space-y-1">
            {FINAL_RATINGS.map((r) => (
              <li key={r.rating}>
                <span className="font-bold">{r.rating}</span> - {r.scores}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
