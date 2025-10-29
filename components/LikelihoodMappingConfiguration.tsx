'use client'

import React, { useState } from 'react'
import { LikelihoodMappingRule, GovernanceLikelihoodConfiguration, Likelihood } from '@/lib/types'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

const LIKELIHOODS: Likelihood[] = ['Mitigated', 'Low', 'Medium', 'High']

interface EditingState {
  depIndex: number | null
  depValue: string
  opIndex: number | null
  opValue: string
}

interface LikelihoodMappingConfigurationProps {
  config: GovernanceLikelihoodConfiguration
  onConfigChange: (config: GovernanceLikelihoodConfiguration) => void
}

export function LikelihoodMappingConfiguration({
  config,
  onConfigChange,
}: LikelihoodMappingConfigurationProps) {
  const [editing, setEditing] = useState<EditingState>({
    depIndex: null,
    depValue: '',
    opIndex: null,
    opValue: '',
  })

  const depEntries = Object.entries(config.dependencies)
  const opEntries = Object.entries(config.operators)

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

  const handleDepNameBlur = (index: number, oldName: string, newName: string) => {
    if (newName && newName !== oldName) {
      const newDeps = { ...config.dependencies }
      const likelihood = newDeps[oldName]
      delete newDeps[oldName]
      newDeps[newName] = likelihood
      onConfigChange({ ...config, dependencies: newDeps })
    }
    setEditing({ ...editing, depIndex: null, depValue: '' })
  }

  const handleOpNameBlur = (index: number, oldName: string, newName: string) => {
    if (newName && newName !== oldName) {
      const newOps = { ...config.operators }
      const likelihood = newOps[oldName]
      delete newOps[oldName]
      newOps[newName] = likelihood
      onConfigChange({ ...config, operators: newOps })
    }
    setEditing({ ...editing, opIndex: null, opValue: '' })
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

      {/* Admin Governance Types */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Admin Governance Types</h3>
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

      {/* Dependencies */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Dependencies</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Define likelihood ratings for external dependencies (e.g., Chainlink, AAVE)
        </p>
        <div className="space-y-3">
          {depEntries.map(([name, likelihood], index) => (
            <div key={index} className="flex gap-2 items-end border rounded-lg p-3">
              <Input
                value={editing.depIndex === index ? editing.depValue : name}
                onChange={(e) => setEditing({ ...editing, depIndex: index, depValue: e.target.value })}
                onBlur={(e) => handleDepNameBlur(index, name, e.target.value)}
                onFocus={() => setEditing({ ...editing, depIndex: index, depValue: name })}
                placeholder="Dependency name (e.g., Chainlink)"
                className="flex-1 text-xs"
              />
              <Select
                value={likelihood}
                onChange={(e) => {
                  const newDeps = { ...config.dependencies, [name]: e.target.value as Likelihood }
                  onConfigChange({ ...config, dependencies: newDeps })
                }}
                className="w-32 text-xs"
              >
                {LIKELIHOODS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </Select>
              <button
                onClick={() => {
                  const newDeps = { ...config.dependencies }
                  delete newDeps[name]
                  onConfigChange({ ...config, dependencies: newDeps })
                }}
                className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newName = `Dependency${depEntries.length + 1}`
              onConfigChange({
                ...config,
                dependencies: { ...config.dependencies, [newName]: 'High' },
              })
            }}
            className="px-3 py-2 border rounded text-xs text-blue-600 hover:bg-blue-50"
          >
            + Add Dependency
          </button>
        </div>
      </div>

      {/* Operators */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Operators</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Define likelihood ratings for operator roles (e.g., Treasury, DAO)
        </p>
        <div className="space-y-3">
          {opEntries.map(([name, likelihood], index) => (
            <div key={index} className="flex gap-2 items-end border rounded-lg p-3">
              <Input
                value={editing.opIndex === index ? editing.opValue : name}
                onChange={(e) => setEditing({ ...editing, opIndex: index, opValue: e.target.value })}
                onBlur={(e) => handleOpNameBlur(index, name, e.target.value)}
                onFocus={() => setEditing({ ...editing, opIndex: index, opValue: name })}
                placeholder="Operator name (e.g., Treasury)"
                className="flex-1 text-xs"
              />
              <Select
                value={likelihood}
                onChange={(e) => {
                  const newOps = { ...config.operators, [name]: e.target.value as Likelihood }
                  onConfigChange({ ...config, operators: newOps })
                }}
                className="w-32 text-xs"
              >
                {LIKELIHOODS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </Select>
              <button
                onClick={() => {
                  const newOps = { ...config.operators }
                  delete newOps[name]
                  onConfigChange({ ...config, operators: newOps })
                }}
                className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newName = `Operator${opEntries.length + 1}`
              onConfigChange({
                ...config,
                operators: { ...config.operators, [newName]: 'High' },
              })
            }}
            className="px-3 py-2 border rounded text-xs text-blue-600 hover:bg-blue-50"
          >
            + Add Operator
          </button>
        </div>
      </div>
    </div>
  )
}
