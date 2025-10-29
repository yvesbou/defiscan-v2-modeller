'use client'

import React from 'react'
import { LikelihoodMappingRule } from '@/lib/types'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'

interface LikelihoodMappingConfigurationProps {
  rules: LikelihoodMappingRule[]
  onRulesChange: (rules: LikelihoodMappingRule[]) => void
}

export function LikelihoodMappingConfiguration({
  rules,
  onRulesChange,
}: LikelihoodMappingConfigurationProps) {
  const handleRuleChange = (
    likelihood: string,
    field: keyof LikelihoodMappingRule,
    value: string | number
  ) => {
    const updatedRules = rules.map((rule) =>
      rule.likelihood === likelihood
        ? { ...rule, [field]: value }
        : rule
    )
    onRulesChange(updatedRules)
  }

  return (
    <div className="border rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Governance Likelihood Mapping</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Configure how governance configurations map to likelihood levels
      </p>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Likelihood</TableHead>
              <TableHead className="w-32">Min Voting Delay (days)</TableHead>
              <TableHead className="w-32">Min Required Voters</TableHead>
              <TableHead className="flex-1">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.likelihood}>
                <TableCell className="p-2 font-semibold">{rule.likelihood}</TableCell>
                <TableCell className="p-2">
                  <Input
                    type="number"
                    min="0"
                    value={rule.votingMinDelayDays}
                    onChange={(e) =>
                      handleRuleChange(
                        rule.likelihood,
                        'votingMinDelayDays',
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full text-xs"
                  />
                </TableCell>
                <TableCell className="p-2">
                  <Input
                    type="number"
                    min="0"
                    value={rule.votingMinVoters}
                    onChange={(e) =>
                      handleRuleChange(
                        rule.likelihood,
                        'votingMinVoters',
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full text-xs"
                  />
                </TableCell>
                <TableCell className="p-2">
                  <Input
                    value={rule.description}
                    onChange={(e) =>
                      handleRuleChange(rule.likelihood, 'description', e.target.value)
                    }
                    className="w-full text-xs"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
