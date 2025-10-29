'use client'

import React from 'react'
import {
  FunctionClassificationEntry,
  FunctionClassificationTable as FunctionTableType,
  Impact,
  Likelihood,
  Severity,
  GovernanceConfig,
  GovernanceType,
  LikelihoodMappingRule,
} from '@/lib/types'
import { IMPACTS, LIKELIHOODS, SEVERITIES } from '@/lib/constants'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { cn, calculateSeverityFromGovernance } from '@/lib/utils'
import { calculateRating } from '@/lib/utils'

interface FunctionClassificationTableProps {
  tableData: FunctionTableType
  severityMatrix: Record<Impact, Record<Likelihood, Severity>>
  likelihoodMappingRules: LikelihoodMappingRule[]
  onTableChange: (table: FunctionTableType) => void
}

const GOVERNANCE_TYPES: GovernanceType[] = [
  'voting',
  'multisig_delay_7d',
  'security_council',
  'eoa',
  'multisig',
]

const getGovernanceTypeLabel = (type: GovernanceType): string => {
  switch (type) {
    case 'voting':
      return 'Voting'
    case 'multisig_delay_7d':
      return 'Multisig (Delay ≥ 7d)'
    case 'security_council':
      return 'Security Council'
    case 'eoa':
      return 'EOA'
    case 'multisig':
      return 'Multisig'
    default:
      return type
  }
}

const getSeverityColor = (severity: Severity): string => {
  switch (severity) {
    case 'Critical':
      return 'bg-red-900 text-white'
    case 'High':
      return 'bg-rose-500 text-white'
    case 'Medium':
      return 'bg-orange-400 text-black'
    case 'Low':
      return 'bg-yellow-400 text-black'
    case 'Informational':
      return 'bg-green-500 text-white'
    default:
      return 'bg-gray-100'
  }
}

export function FunctionClassificationTable({
  tableData,
  severityMatrix,
  likelihoodMappingRules,
  onTableChange,
}: FunctionClassificationTableProps) {
  const handleTitleChange = (newTitle: string) => {
    onTableChange({ ...tableData, title: newTitle })
  }

  const handleEntryChange = (id: string, updates: Partial<FunctionClassificationEntry>) => {
    const newEntries = tableData.entries.map((entry) => {
      if (entry.id === id) {
        // Handle governance config updates (including nested properties)
        let governance: GovernanceConfig = entry.governance
        if (updates.governance) {
          governance = {
            type: updates.governance.type ?? entry.governance.type,
            votingDelayDays: updates.governance.votingDelayDays ?? entry.governance.votingDelayDays,
            requiredVoters: updates.governance.requiredVoters ?? entry.governance.requiredVoters,
          }
        }

        // Auto-calculate severity if impact or governance changed
        let severity = updates.severity !== undefined ? updates.severity : entry.severity
        if (
          updates.impact !== undefined ||
          updates.governance !== undefined
        ) {
          const impact = (updates.impact ?? entry.impact) as Impact
          severity = calculateSeverityFromGovernance(
            impact,
            governance,
            severityMatrix,
            likelihoodMappingRules
          )
        }

        const { governance: _, ...otherUpdates } = updates // Extract governance from updates to handle separately

        return {
          ...entry,
          ...otherUpdates,
          governance,
          severity,
        }
      }
      return entry
    })
    onTableChange({ ...tableData, entries: newEntries })
  }

  const handleAddRow = () => {
    const defaultGovernance: GovernanceConfig = {
      type: 'eoa',
    }
    const newEntry: FunctionClassificationEntry = {
      id: Date.now().toString(),
      function: '',
      impact: 'Low',
      governance: defaultGovernance,
      severity: calculateSeverityFromGovernance(
        'Low',
        defaultGovernance,
        severityMatrix,
        likelihoodMappingRules
      ),
    }
    onTableChange({ ...tableData, entries: [...tableData.entries, newEntry] })
  }

  const handleRemoveRow = (id: string) => {
    onTableChange({
      ...tableData,
      entries: tableData.entries.filter((entry) => entry.id !== id),
    })
  }

  const projectRating = calculateRating(tableData.entries)

  return (
    <div className="border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Project:</label>
            <Input
              value={tableData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter project name"
              className="max-w-xs"
            />
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Rating</p>
          <p className="text-lg font-bold">{projectRating}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Function</TableHead>
              <TableHead className="w-20">Impact</TableHead>
              <TableHead className="w-40">Governance Type</TableHead>
              <TableHead className="w-32">Severity Score</TableHead>
              <TableHead className="w-20 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.entries.map((entry) => {
              // Ensure entry has governance, otherwise use default
              const governance = entry.governance || { type: 'eoa' as const };

              return (
              <React.Fragment key={entry.id}>
                <TableRow>
                  <TableCell className="p-2">
                    <Input
                      value={entry.function}
                      onChange={(e) => handleEntryChange(entry.id, { function: e.target.value })}
                      placeholder="e.g., Proxy(PoolConfigurator).update"
                      className="w-full text-xs"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Select
                      value={entry.impact}
                      onChange={(e) =>
                        handleEntryChange(entry.id, { impact: e.target.value as Impact })
                      }
                      className="w-full h-8 text-xs"
                    >
                      {(IMPACTS as readonly Impact[]).map((impact) => (
                        <option key={impact} value={impact}>
                          {impact}
                        </option>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell className="p-2">
                    <Select
                      value={governance.type}
                      onChange={(e) =>
                        handleEntryChange(entry.id, {
                          governance: { type: e.target.value as GovernanceType },
                        })
                      }
                      className="w-full h-8 text-xs"
                    >
                      {GOVERNANCE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {getGovernanceTypeLabel(type)}
                        </option>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell className="p-2">
                    <Select
                      value={entry.severity}
                      onChange={(e) =>
                        handleEntryChange(entry.id, { severity: e.target.value as Severity })
                      }
                      className={cn(
                        'w-full h-8 text-xs font-semibold rounded border-0',
                        getSeverityColor(entry.severity)
                      )}
                    >
                      {(SEVERITIES as readonly Severity[]).map((severity) => (
                        <option key={severity} value={severity}>
                          {severity}
                        </option>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell className="p-2 text-center">
                    <Button
                      onClick={() => handleRemoveRow(entry.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive hover:text-white"
                    >
                      ✕
                    </Button>
                  </TableCell>
                </TableRow>
                {/* Voting governance - show additional fields */}
                {governance.type === 'voting' && (
                  <TableRow>
                    <TableCell colSpan={5} className="p-2 bg-muted/50">
                      <div className="flex gap-4 items-end">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-medium">Voting Delay (days):</label>
                          <Input
                            type="number"
                            min="0"
                            value={governance.votingDelayDays ?? 0}
                            onChange={(e) =>
                              handleEntryChange(entry.id, {
                                governance: {
                                  type: governance.type,
                                  votingDelayDays: parseInt(e.target.value) || 0,
                                  requiredVoters: governance.requiredVoters,
                                },
                              })
                            }
                            className="w-20 h-8 text-xs"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-medium">Required Voters:</label>
                          <Input
                            type="number"
                            min="0"
                            value={governance.requiredVoters ?? 0}
                            onChange={(e) =>
                              handleEntryChange(entry.id, {
                                governance: {
                                  type: governance.type,
                                  votingDelayDays: governance.votingDelayDays,
                                  requiredVoters: parseInt(e.target.value) || 0,
                                },
                              })
                            }
                            className="w-20 h-8 text-xs"
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
            })}
          </TableBody>
        </Table>
      </div>

      <Button onClick={handleAddRow} variant="outline" className="mt-4">
        Add Row
      </Button>
    </div>
  )
}
