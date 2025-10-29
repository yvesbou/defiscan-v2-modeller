'use client'

import React from 'react'
import { FunctionClassificationEntry, FunctionClassificationTable as FunctionTableType, Impact, Likelihood, Severity } from '@/lib/types'
import { IMPACTS, LIKELIHOODS, SEVERITIES } from '@/lib/constants'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { calculateRating } from '@/lib/utils'

interface FunctionClassificationTableProps {
  tableData: FunctionTableType
  severityMatrix: Record<Impact, Record<Likelihood, Severity>>
  onTableChange: (table: FunctionTableType) => void
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
  onTableChange,
}: FunctionClassificationTableProps) {
  const handleTitleChange = (newTitle: string) => {
    onTableChange({ ...tableData, title: newTitle })
  }

  const handleEntryChange = (id: string, updates: Partial<FunctionClassificationEntry>) => {
    const newEntries = tableData.entries.map((entry) => {
      if (entry.id === id) {
        // Auto-calculate severity if impact or likelihood changed
        let severity = updates.severity !== undefined ? updates.severity : entry.severity
        if (updates.impact !== undefined || updates.likelihood !== undefined) {
          const impact = (updates.impact ?? entry.impact) as Impact
          const likelihood = (updates.likelihood ?? entry.likelihood) as Likelihood
          severity = severityMatrix[impact][likelihood]
        }
        return { ...entry, ...updates, severity }
      }
      return entry
    })
    onTableChange({ ...tableData, entries: newEntries })
  }

  const handleAddRow = () => {
    const newEntry: FunctionClassificationEntry = {
      id: Date.now().toString(),
      function: '',
      impact: 'Low',
      likelihood: 'Low',
      severity: severityMatrix['Low']['Low'],
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
              <TableHead className="w-1/3">Function</TableHead>
              <TableHead className="w-24">Impact</TableHead>
              <TableHead className="w-32">Likelihood</TableHead>
              <TableHead className="w-32">Severity Score</TableHead>
              <TableHead className="w-20 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.entries.map((entry) => (
              <TableRow key={entry.id}>
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
                    value={entry.likelihood}
                    onChange={(e) =>
                      handleEntryChange(entry.id, { likelihood: e.target.value as Likelihood })
                    }
                    className="w-full h-8 text-xs"
                  >
                    {(LIKELIHOODS as readonly Likelihood[]).map((likelihood) => (
                      <option key={likelihood} value={likelihood}>
                        {likelihood}
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
            ))}
          </TableBody>
        </Table>
      </div>

      <Button onClick={handleAddRow} variant="outline" className="mt-4">
        Add Row
      </Button>
    </div>
  )
}
