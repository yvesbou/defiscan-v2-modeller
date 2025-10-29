"use client";

import React, { useState, useEffect } from "react";
import {
  FunctionClassificationTable as FunctionTableType,
  Impact,
  Likelihood,
  Severity,
  RatingRule,
} from "@/lib/types";
import {
  DEFAULT_SEVERITY_MATRIX_2D,
  DEFAULT_SEVERITY_MATRIX_FLAT,
  DEFAULT_RATING_RULES,
} from "@/lib/constants";
import { SeverityRatingsTable } from "@/components/SeverityRatingsTable";
import { FunctionClassificationTable } from "@/components/FunctionClassificationTable";
import { FinalRatingsVisualization } from "@/components/FinalRatingsVisualization";
import { EditableRatingRules } from "@/components/EditableRatingRules";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

const STORAGE_KEY_MATRIX = "defiscan_severity_matrix";
const STORAGE_KEY_TABLES = "defiscan_function_tables";
const STORAGE_KEY_RULES = "defiscan_rating_rules";

export default function Home() {
  const [severityMatrix, setSeverityMatrix] = useState<
    Record<Impact, Record<Likelihood, Severity>>
  >(DEFAULT_SEVERITY_MATRIX_2D);
  const [functionTables, setFunctionTables] = useState<FunctionTableType[]>([]);
  const [ratingRules, setRatingRules] = useState<RatingRule[]>(DEFAULT_RATING_RULES);
  const [mounted, setMounted] = useState(false);

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
        setFunctionTables(JSON.parse(savedTables));
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
          (rule: RatingRule) => rule.rating === "AAA" && rule.severity === "" && rule.impact === ""
        );

        if (hasEmptyAAARow) {
          setRatingRules(parsedRules);
        } else {
          // Old format detected, reset to defaults
          console.warn("Old rating rules format detected, resetting to defaults");
          localStorage.removeItem(STORAGE_KEY_RULES);
        }
      } catch (e) {
        console.error("Failed to load rating rules", e);
        localStorage.removeItem(STORAGE_KEY_RULES);
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

  // Update all function entries when severity matrix changes
  // This ensures that when a user modifies the severity matrix,
  // all function classification entries automatically recalculate their severity scores
  useEffect(() => {
    if (!mounted || functionTables.length === 0) return;

    const updatedTables = functionTables.map((table) => ({
      ...table,
      entries: table.entries.map((entry) => ({
        ...entry,
        // Recalculate severity based on current matrix
        severity: severityMatrix[entry.impact][entry.likelihood],
      })),
    }));

    setFunctionTables(updatedTables);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [severityMatrix, mounted]);

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
        <FinalRatingsVisualization functionTables={functionTables} ratingRules={ratingRules} />

        {/* Severity Ratings Matrix */}
        <SeverityRatingsTable
          matrix={severityMatrix}
          onMatrixChange={setSeverityMatrix}
        />

        {/* Editable Rating Rules */}
        <EditableRatingRules
          rules={ratingRules}
          onRulesChange={setRatingRules}
        />

        {/* Projects */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Projects</h2>
          {functionTables.map((table) => (
            <div key={table.id} className="relative">
              <FunctionClassificationTable
                tableData={table}
                severityMatrix={severityMatrix}
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
