'use client'

import React, { useState } from 'react'
import { Impact, Likelihood, Severity } from '@/lib/types'
import { IMPACTS, LIKELIHOODS, SEVERITIES } from '@/lib/constants'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Select } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface SeverityRatingsTableProps {
  matrix: Record<Impact, Record<Likelihood, Severity>>
  onMatrixChange: (matrix: Record<Impact, Record<Likelihood, Severity>>) => void
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

export function SeverityRatingsTable({ matrix, onMatrixChange }: SeverityRatingsTableProps) {
  const handleSeverityChange = (impact: Impact, likelihood: Likelihood, severity: Severity) => {
    const newMatrix = { ...matrix }
    newMatrix[impact] = { ...newMatrix[impact], [likelihood]: severity }
    onMatrixChange(newMatrix)
  }

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Severity Ratings Matrix</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Impact × Likelihood → Severity (editable)
      </p>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Impact \ Likelihood</TableHead>
              {(LIKELIHOODS as readonly Likelihood[]).map((likelihood) => (
                <TableHead key={likelihood} className="text-center w-32">
                  {likelihood}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {(IMPACTS as readonly Impact[]).map((impact) => (
              <TableRow key={impact}>
                <TableHead className="font-semibold bg-muted/50">{impact}</TableHead>
                {(LIKELIHOODS as readonly Likelihood[]).map((likelihood) => {
                  const currentSeverity = matrix[impact][likelihood]
                  return (
                    <TableCell key={`${impact}-${likelihood}`} className="text-center p-1">
                      <Select
                        value={currentSeverity}
                        onChange={(e) =>
                          handleSeverityChange(impact, likelihood, e.target.value as Severity)
                        }
                        className={cn(
                          'w-full h-8 text-xs font-semibold rounded border-0',
                          getSeverityColor(currentSeverity)
                        )}
                      >
                        {(SEVERITIES as readonly Severity[]).map((severity) => (
                          <option key={severity} value={severity}>
                            {severity}
                          </option>
                        ))}
                      </Select>
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
