'use client'

import React from 'react'
import { LikelihoodMappingRule, GovernanceLikelihoodConfiguration, Likelihood } from '@/lib/types'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

const LIKELIHOODS: Likelihood[] = ['Mitigated', 'Low', 'Medium', 'High']

interface LikelihoodMappingConfigurationProps {
  config: GovernanceLikelihoodConfiguration
  onConfigChange: (config: GovernanceLikelihoodConfiguration) => void
}

export function LikelihoodMappingConfiguration({
  config,
  onConfigChange,
}: LikelihoodMappingConfigurationProps) {
  const handleVotingRuleChange = (
    likelihood: string,
    field: keyof LikelihoodMappingRule,
    value: string | number
  ) => {
    const updatedRules = config.voting.map((rule) =>
      rule.likelihood === likelihood
        ? { ...rule, [field]: value }
        : rule
    )
    onConfigChange({ ...config, voting: updatedRules })
  }

  const handleGovernanceTypeChange = (
    governance: 'eoa' | 'multisig' | 'multisig_delay_7d' | 'security_council',
    likelihood: Likelihood
  ) => {
    onConfigChange({ ...config, [governance]: likelihood })
  }

  return (
    <div className="border rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Governance Likelihood Mapping</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Configure how governance types map to likelihood levels
      </p>

      {/* Voting Governance Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Voting Governance</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Configure voting parameter thresholds for each likelihood level
        </p>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Likelihood</TableHead>
                <TableHead className="w-32">Min Voting Delay (days)</TableHead>
                <TableHead className="w-32">Min Required Voters</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {config.voting.map((rule) => (
                <TableRow key={rule.likelihood}>
                  <TableCell className="p-2 font-semibold">{rule.likelihood}</TableCell>
                  <TableCell className="p-2">
                    <Input
                      type="number"
                      min="0"
                      value={rule.votingMinDelayDays}
                      onChange={(e) =>
                        handleVotingRuleChange(
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
                        handleVotingRuleChange(
                          rule.likelihood,
                          'votingMinVoters',
                          parseInt(e.target.value) || 0
                        )
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

      {/* Other Governance Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EOA */}
        <div className="border rounded-lg p-4">
          <label className="block text-sm font-semibold mb-2">EOA (Externally Owned Account)</label>
          <Select
            value={config.eoa}
            onChange={(e) => handleGovernanceTypeChange('eoa', e.target.value as Likelihood)}
            className="w-full"
          >
            {LIKELIHOODS.map((likelihood) => (
              <option key={likelihood} value={likelihood}>
                {likelihood}
              </option>
            ))}
          </Select>
        </div>

        {/* Multisig */}
        <div className="border rounded-lg p-4">
          <label className="block text-sm font-semibold mb-2">Multisig (No Delay)</label>
          <Select
            value={config.multisig}
            onChange={(e) => handleGovernanceTypeChange('multisig', e.target.value as Likelihood)}
            className="w-full"
          >
            {LIKELIHOODS.map((likelihood) => (
              <option key={likelihood} value={likelihood}>
                {likelihood}
              </option>
            ))}
          </Select>
        </div>

        {/* Multisig with Delay */}
        <div className="border rounded-lg p-4">
          <label className="block text-sm font-semibold mb-2">Multisig with Delay ≥ 7d</label>
          <Select
            value={config.multisig_delay_7d}
            onChange={(e) => handleGovernanceTypeChange('multisig_delay_7d', e.target.value as Likelihood)}
            className="w-full"
          >
            {LIKELIHOODS.map((likelihood) => (
              <option key={likelihood} value={likelihood}>
                {likelihood}
              </option>
            ))}
          </Select>
        </div>

        {/* Security Council */}
        <div className="border rounded-lg p-4">
          <label className="block text-sm font-semibold mb-2">Security Council</label>
          <Select
            value={config.security_council}
            onChange={(e) => handleGovernanceTypeChange('security_council', e.target.value as Likelihood)}
            className="w-full"
          >
            {LIKELIHOODS.map((likelihood) => (
              <option key={likelihood} value={likelihood}>
                {likelihood}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )
}
