"use client";

import {
  FunctionClassificationTable as FunctionTableType,
  FinalRating,
  RatingRule,
  Stage,
  StageEntry,
  LikelihoodMappingRule,
} from "@/lib/types";
import { STAGE_ENTRIES } from "@/lib/constants";
import { calculateRatingWithRules } from "@/lib/utils";

interface FinalRatingsVisualizationProps {
  functionTables: FunctionTableType[];
  ratingRules: RatingRule[];
  likelihoodMappingRules: LikelihoodMappingRule[];
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

const getStageColor = (stage: Stage): string => {
  switch (stage) {
    case "Stage 2":
      return "bg-green-100 dark:bg-green-900";
    case "Stage 1":
      return "bg-yellow-100 dark:bg-yellow-900";
    case "Stage 0":
      return "bg-red-100 dark:bg-red-900";
    default:
      return "bg-gray-100 dark:bg-gray-900";
  }
};

const getStageTextColor = (stage: Stage): string => {
  switch (stage) {
    case "Stage 2":
      return "text-green-800 dark:text-green-200";
    case "Stage 1":
      return "text-yellow-800 dark:text-yellow-200";
    case "Stage 0":
      return "text-red-800 dark:text-red-200";
    default:
      return "text-gray-800 dark:text-gray-200";
  }
};

export function FinalRatingsVisualization({
  functionTables,
  ratingRules,
  likelihoodMappingRules,
}: FinalRatingsVisualizationProps) {
  const allEntries = functionTables.flatMap((table) => table.entries);

  // Calculate the final rating based on worst case
  const finalRating = calculateRatingWithRules(
    allEntries,
    ratingRules,
    likelihoodMappingRules
  );

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
    rating: calculateRatingWithRules(
      table.entries,
      ratingRules,
      likelihoodMappingRules
    ),
  }));

  // Group projects by rating
  const projectsByRating = projectRatings.reduce((acc, project) => {
    if (!acc[project.rating]) {
      acc[project.rating] = [];
    }
    acc[project.rating].push(project);
    return acc;
  }, {} as Record<FinalRating, typeof projectRatings>);

  return (
    <div className="border rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">Risk Ratings</h2>

      {/* Rating Scale Visualization */}
      <div className="mb-8">
        <p className="text-sm font-semibold mb-4">Rating v2</p>

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
                  <div
                    style={{ height: `${totalHeight}px`, position: "relative" }}
                  >
                    {Object.entries(projectsByRating).map(
                      ([rating, projects]) => {
                        const projectRatingIndex = ratings.indexOf(
                          rating as FinalRating
                        );
                        const projectPosition =
                          (projectRatingIndex / (ratings.length - 1)) * 100;

                        const finalProjectPosition =
                          projectPosition > 50
                            ? projectPosition - 3
                            : projectPosition + 3;

                        // Calculate how many empty rows are above this group
                        const emptyRowsAbove =
                          maxProjectsInGroup - projects.length;
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
                                  style={{
                                    height: `${rowHeight}px`,
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <span className="w-16">{project.name}</span>
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
                            <div
                              className="w-px bg-gray-400 dark:bg-gray-500 mt-1"
                              style={{ height: "24px" }}
                            />
                          </div>
                        );
                      }
                    )}
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

        {/* Stage Classification Bar */}
        <div className="mt-16">
          <p className="text-sm font-semibold my-10">Rating v1</p>

          {(() => {
            // Group protocols by stage
            const protocolsByStage = STAGE_ENTRIES.reduce((acc, protocol) => {
              if (!acc[protocol.stage]) {
                acc[protocol.stage] = [];
              }
              acc[protocol.stage].push(protocol);
              return acc;
            }, {} as Record<Stage, StageEntry[]>);

            const stages: Stage[] = ["Stage 2", "Stage 1", "Stage 0"];
            const maxProtocolsInGroup = Math.max(
              ...stages.map((stage) => protocolsByStage[stage]?.length || 0)
            );
            const rowHeight = 22;
            const totalHeight = maxProtocolsInGroup * rowHeight + 40;

            return (
              <div className="relative -mx-6 -mb-6">
                {/* Protocol names above the bar */}
                <div
                  className="relative mb-0"
                  style={{
                    height: `${totalHeight}px`,
                    position: "relative",
                  }}
                >
                  {stages.map((stage) => {
                    const protocols = protocolsByStage[stage] || [];
                    const stageIndex = stages.indexOf(stage);
                    const stagePosition =
                      (stageIndex / (stages.length - 1)) * 100;

                    const finalStagePosition =
                      stagePosition > 50
                        ? stagePosition - 15
                        : stagePosition == 50
                        ? stagePosition
                        : stagePosition + 15;

                    const emptyRowsAbove =
                      maxProtocolsInGroup - protocols.length;
                    const topOffset = emptyRowsAbove * rowHeight;

                    return (
                      <div
                        key={stage}
                        className="absolute flex flex-col items-center"
                        style={{
                          left: `${finalStagePosition}%`,
                          transform: "translateX(-50%)",
                          top: `${topOffset}px`,
                        }}
                      >
                        {/* Container for vertically stacked protocols */}
                        <div className="flex flex-col items-center gap-0">
                          {protocols.map((protocol, groupIdx) => (
                            <div
                              key={`${stage}-${groupIdx}`}
                              className="text-xs font-semibold whitespace-nowrap text-center"
                              style={{
                                height: `${rowHeight}px`,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <span className="w-20">{protocol.name}</span>
                            </div>
                          ))}
                        </div>

                        {/* Stage label shown once below all protocols */}
                        <span
                          className={`font-bold text-xs ${getStageTextColor(
                            stage
                          )}`}
                        >
                          {stage}
                        </span>

                        {/* Single vertical connecting line */}
                        <div
                          className="w-px bg-gray-400 dark:bg-gray-500 mt-1"
                          style={{ height: "24px" }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Stage Bar - 3 sections with fixed positions */}
                <div className="relative flex border-2 border-gray-300 dark:border-gray-600">
                  <div className="flex-1 bg-green-100 dark:bg-green-900 border-r border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs font-bold px-6 py-2">
                    <span className="text-green-800 dark:text-green-200">
                      Stage 2
                    </span>
                  </div>
                  <div className="flex-1 bg-yellow-100 dark:bg-yellow-900 border-r border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs font-bold px-6 py-2">
                    <span className="text-yellow-800 dark:text-yellow-200">
                      Stage 1
                    </span>
                  </div>
                  <div className="flex-1 bg-red-100 dark:bg-red-900 flex items-center justify-center text-xs font-bold px-6 py-2">
                    <span className="text-red-800 dark:text-red-200">
                      Stage 0
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
