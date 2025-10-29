"use client";

import React, { useState, useEffect } from "react";
import {
  FunctionClassificationTable as FunctionTableType,
  Impact,
  Likelihood,
  Severity,
  RatingRule,
  GovernanceLikelihoodConfiguration,
} from "@/lib/types";
import {
  DEFAULT_SEVERITY_MATRIX_2D,
  DEFAULT_SEVERITY_MATRIX_FLAT,
  DEFAULT_RATING_RULES,
  DEFAULT_GOVERNANCE_LIKELIHOOD_CONFIG,
} from "@/lib/constants";
import { calculateSeverityFromGovernance } from "@/lib/utils";
import { SeverityRatingsTable } from "@/components/SeverityRatingsTable";
import { FunctionClassificationTable } from "@/components/FunctionClassificationTable";
import { FinalRatingsVisualization } from "@/components/FinalRatingsVisualization";
import { EditableRatingRules } from "@/components/EditableRatingRules";
import { LikelihoodMappingConfiguration } from "@/components/LikelihoodMappingConfiguration";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

const STORAGE_KEY_MATRIX = "defiscan_severity_matrix";
const STORAGE_KEY_TABLES = "defiscan_function_tables";
const STORAGE_KEY_RULES = "defiscan_rating_rules";
const STORAGE_KEY_LIKELIHOOD_MAPPING = "defiscan_likelihood_mapping";

// Migration function to convert old entries (with likelihood) to new entries (with governance)
function migrateTableData(tables: any[]): FunctionTableType[] {
  return tables.map((table: any) => ({
    ...table,
    entries: table.entries.map((entry: any) => {
      // If entry already has governance with functionType, keep it as is
      if (entry.governance && entry.governance.functionType) {
        return entry;
      }
      // If entry has governance with type (old format), convert to new format
      if (
        entry.governance &&
        (entry.governance.type || (entry.governance as any).governanceType)
      ) {
        return {
          ...entry,
          governance: {
            functionType: "Admin" as const,
            governanceType:
              entry.governance.type || (entry.governance as any).governanceType,
            votingDelayDays: entry.governance.votingDelayDays,
            requiredVoters: entry.governance.requiredVoters,
          },
        };
      }
      // Otherwise, initialize with default governance (Admin with eoa)
      const { likelihood, ...entryWithoutLikelihood } = entry;
      return {
        ...entryWithoutLikelihood,
        governance: {
          functionType: "Admin" as const,
          governanceType: "eoa" as const,
        },
      };
    }),
  }));
}

// Migration function to convert old LikelihoodMappingRule[] to new GovernanceLikelihoodConfiguration
function migrateGovernanceLikelihoodConfig(
  data: any
): GovernanceLikelihoodConfiguration {
  // If it's already in the new format (has voting property), ensure dependencies and operators are present
  if (data && typeof data === "object" && "voting" in data) {
    return {
      ...DEFAULT_GOVERNANCE_LIKELIHOOD_CONFIG,
      ...data,
      dependencies: data.dependencies || {},
      operators: data.operators || {},
    };
  }

  // If it's old format (array of LikelihoodMappingRule), convert it
  if (Array.isArray(data)) {
    return {
      voting: data,
      eoa: "High",
      multisig: "High",
      multisig_delay_7d: "Medium",
      security_council: "Medium",
      dependencies: {},
      operators: {},
    };
  }

  // Otherwise return defaults
  return DEFAULT_GOVERNANCE_LIKELIHOOD_CONFIG;
}

export default function Home() {
  const [severityMatrix, setSeverityMatrix] = useState<
    Record<Impact, Record<Likelihood, Severity>>
  >(DEFAULT_SEVERITY_MATRIX_2D);
  const [functionTables, setFunctionTables] = useState<FunctionTableType[]>([]);
  const [ratingRules, setRatingRules] =
    useState<RatingRule[]>(DEFAULT_RATING_RULES);
  const [governanceLikelihoodConfig, setGovernanceLikelihoodConfig] =
    useState<GovernanceLikelihoodConfiguration>(
      DEFAULT_GOVERNANCE_LIKELIHOOD_CONFIG
    );
  const [mounted, setMounted] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    ratingRules: true,
    severityMatrix: true,
    likelihoodMapping: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Load from localStorage on mount
  useEffect(() => {
    const savedMatrix = localStorage.getItem(STORAGE_KEY_MATRIX);
    const savedTables = localStorage.getItem(STORAGE_KEY_TABLES);
    const savedRules = localStorage.getItem(STORAGE_KEY_RULES);

    if (savedMatrix) {
      try {
        setSeverityMatrix(JSON.parse(savedMatrix));
      } catch (e) {
        console.error("Failed to load severity matrix", e);
      }
    }

    if (savedTables) {
      try {
        const parsedTables = JSON.parse(savedTables);
        const migratedTables = migrateTableData(parsedTables);
        setFunctionTables(migratedTables);
      } catch (e) {
        console.error("Failed to load function tables", e);
        setFunctionTables([
          {
            id: Date.now().toString(),
            title: "Function Classifications",
            entries: [],
          },
        ]);
      }
    } else {
      // Initialize with one empty table
      setFunctionTables([
        {
          id: Date.now().toString(),
          title: "Function Classifications",
          entries: [],
        },
      ]);
    }

    if (savedRules) {
      try {
        const parsedRules = JSON.parse(savedRules);
        // Validate that we have the new format with the empty AAA row
        const hasEmptyAAARow = parsedRules.some(
          (rule: RatingRule) =>
            rule.rating === "AAA" && rule.severity === "" && rule.impact === ""
        );

        if (hasEmptyAAARow) {
          setRatingRules(parsedRules);
        } else {
          // Old format detected, reset to defaults
          console.warn(
            "Old rating rules format detected, resetting to defaults"
          );
          localStorage.removeItem(STORAGE_KEY_RULES);
        }
      } catch (e) {
        console.error("Failed to load rating rules", e);
        localStorage.removeItem(STORAGE_KEY_RULES);
      }
    }

    const savedLikelihoodMapping = localStorage.getItem(
      STORAGE_KEY_LIKELIHOOD_MAPPING
    );
    if (savedLikelihoodMapping) {
      try {
        const parsedData = JSON.parse(savedLikelihoodMapping);
        const migratedConfig = migrateGovernanceLikelihoodConfig(parsedData);
        setGovernanceLikelihoodConfig(migratedConfig);
      } catch (e) {
        console.error("Failed to load governance likelihood config", e);
      }
    }

    setMounted(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY_MATRIX, JSON.stringify(severityMatrix));
  }, [severityMatrix, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY_TABLES, JSON.stringify(functionTables));
  }, [functionTables, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(ratingRules));
  }, [ratingRules, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(
      STORAGE_KEY_LIKELIHOOD_MAPPING,
      JSON.stringify(governanceLikelihoodConfig)
    );
  }, [governanceLikelihoodConfig, mounted]);

  // Update all function entries when severity matrix or likelihood mapping changes
  // This ensures that when a user modifies the severity matrix or governance,
  // all function classification entries automatically recalculate their severity scores
  useEffect(() => {
    if (!mounted || functionTables.length === 0) return;

    const updatedTables = functionTables.map((table) => ({
      ...table,
      entries: table.entries.map((entry) => ({
        ...entry,
        // Recalculate severity based on governance config and current matrix
        severity: calculateSeverityFromGovernance(
          entry.impact,
          entry.governance,
          severityMatrix,
          governanceLikelihoodConfig
        ),
      })),
    }));

    setFunctionTables(updatedTables);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [severityMatrix, governanceLikelihoodConfig, mounted]);

  const handleAddTable = () => {
    const newTable: FunctionTableType = {
      id: Date.now().toString(),
      title: `Function Classifications ${functionTables.length + 1}`,
      entries: [],
    };
    setFunctionTables([...functionTables, newTable]);
  };

  const handleRemoveTable = (id: string) => {
    setFunctionTables(functionTables.filter((table) => table.id !== id));
  };

  const handleTableChange = (updatedTable: FunctionTableType) => {
    setFunctionTables(
      functionTables.map((table) =>
        table.id === updatedTable.id ? updatedTable : table
      )
    );
  };

  const allEntries = functionTables.flatMap((table) => table.entries);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="container mx-auto py-8">
        <header className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">DeFiScan V2 Modeller</h1>
            <p className="text-muted-foreground">
              Create projects and generate risk ratings based on function impact
              and likelihood
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* Final Rating Visualization at the top */}
        <FinalRatingsVisualization
          functionTables={functionTables}
          ratingRules={ratingRules}
          likelihoodMappingRules={governanceLikelihoodConfig.voting}
        />

        {/* Editable Rating Rules - Collapsible */}
        <div className="border rounded-lg p-6 mb-6">
          <button
            onClick={() => toggleSection("ratingRules")}
            className="flex items-center justify-between w-full cursor-pointer hover:opacity-80"
          >
            <h2 className="text-xl font-semibold">
              Rating Scale Configuration
            </h2>
            <span className="text-2xl font-bold">
              {expandedSections.ratingRules ? "−" : "+"}
            </span>
          </button>
          {expandedSections.ratingRules && (
            <div className="mt-4">
              <EditableRatingRules
                rules={ratingRules}
                onRulesChange={setRatingRules}
              />
            </div>
          )}
        </div>

        {/* Severity Ratings Matrix - Collapsible */}
        <div className="border rounded-lg p-6 mb-6">
          <button
            onClick={() => toggleSection("severityMatrix")}
            className="flex items-center justify-between w-full cursor-pointer hover:opacity-80"
          >
            <h2 className="text-xl font-semibold">Severity Ratings Matrix</h2>
            <span className="text-2xl font-bold">
              {expandedSections.severityMatrix ? "−" : "+"}
            </span>
          </button>
          {expandedSections.severityMatrix && (
            <div className="mt-4">
              <SeverityRatingsTable
                matrix={severityMatrix}
                onMatrixChange={setSeverityMatrix}
              />
            </div>
          )}
        </div>

        {/* Likelihood Mapping Configuration - Collapsible */}
        <div className="border rounded-lg p-6 mb-6">
          <button
            onClick={() => toggleSection("likelihoodMapping")}
            className="flex items-center justify-between w-full cursor-pointer hover:opacity-80"
          >
            <h2 className="text-xl font-semibold">Likelihood Mapping</h2>
            <span className="text-2xl font-bold">
              {expandedSections.likelihoodMapping ? "−" : "+"}
            </span>
          </button>
          {expandedSections.likelihoodMapping && (
            <div className="mt-4">
              <LikelihoodMappingConfiguration
                config={governanceLikelihoodConfig}
                onConfigChange={setGovernanceLikelihoodConfig}
              />
            </div>
          )}
        </div>

        {/* Projects */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Projects</h2>
          {functionTables.map((table) => (
            <div key={table.id} className="relative">
              <FunctionClassificationTable
                tableData={table}
                severityMatrix={severityMatrix}
                governanceLikelihoodConfig={governanceLikelihoodConfig}
                onTableChange={handleTableChange}
              />
              {functionTables.length > 1 && (
                <Button
                  onClick={() => handleRemoveTable(table.id)}
                  variant="destructive"
                  size="sm"
                  className="absolute -top-1 -right-1"
                >
                  ✕
                </Button>
              )}
            </div>
          ))}

          <Button onClick={handleAddTable} variant="default" className="mt-4">
            + Add Project
          </Button>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>DeFiScan V2 Modeller • Data is not persisting</p>
        </footer>
      </div>
    </main>
  );
}
