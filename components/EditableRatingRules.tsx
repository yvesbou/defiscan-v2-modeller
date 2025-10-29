"use client";

import React from "react";
import { RatingRule } from "@/lib/types";
import { SEVERITIES, IMPACTS } from "@/lib/constants";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface EditableRatingRulesProps {
  rules: RatingRule[];
  onRulesChange: (rules: RatingRule[]) => void;
}

export function EditableRatingRules({
  rules,
  onRulesChange,
}: EditableRatingRulesProps) {
  const handleRuleChange = (
    id: string,
    field: keyof RatingRule,
    value: string
  ) => {
    const updatedRules = rules.map((rule) =>
      rule.id === id ? { ...rule, [field]: value } : rule
    );
    onRulesChange(updatedRules);
  };

  return (
    <div className="border rounded-lg p-6 my-6">
      <h2 className="text-xl font-semibold mb-4">Rating Scale Configuration</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Define how Severity and Impact combinations map to final ratings
      </p>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Rating</TableHead>
              <TableHead className="w-32">Severity</TableHead>
              <TableHead className="w-32">Impact</TableHead>
              <TableHead className="flex-1">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="p-2">
                  <Input
                    value={rule.rating}
                    onChange={(e) =>
                      handleRuleChange(rule.id, "rating", e.target.value)
                    }
                    placeholder="e.g., AAA"
                    className="w-full text-xs font-bold"
                  />
                </TableCell>
                <TableCell className="p-2">
                  {rule.severity === "" ? (
                    <div className="text-xs text-center text-muted-foreground font-semibold">
                      -
                    </div>
                  ) : (
                    <Select
                      value={rule.severity}
                      onChange={(e) =>
                        handleRuleChange(rule.id, "severity", e.target.value)
                      }
                      className="w-full h-8 text-xs"
                    >
                      {(
                        SEVERITIES as readonly (typeof SEVERITIES)[number][]
                      ).map((severity) => (
                        <option key={severity} value={severity}>
                          {severity}
                        </option>
                      ))}
                    </Select>
                  )}
                </TableCell>
                <TableCell className="p-2">
                  {rule.impact === "" ? (
                    <div className="text-xs text-center text-muted-foreground font-semibold">
                      -
                    </div>
                  ) : (
                    <Select
                      value={rule.impact}
                      onChange={(e) =>
                        handleRuleChange(rule.id, "impact", e.target.value)
                      }
                      className="w-full h-8 text-xs"
                    >
                      {(IMPACTS as readonly (typeof IMPACTS)[number][]).map(
                        (impact) => (
                          <option key={impact} value={impact}>
                            {impact}
                          </option>
                        )
                      )}
                    </Select>
                  )}
                </TableCell>
                <TableCell className="p-2">
                  <Input
                    value={rule.description}
                    onChange={(e) =>
                      handleRuleChange(rule.id, "description", e.target.value)
                    }
                    placeholder="e.g., Immutable and autonomous"
                    className="w-full text-xs"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
