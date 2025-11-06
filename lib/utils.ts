import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  FunctionClassificationEntry,
  FinalRating,
  Severity,
  Impact,
  RatingRule,
  GovernanceConfig,
  Likelihood,
  LikelihoodMappingRule,
  GovernanceLikelihoodConfiguration,
} from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const SEVERITY_ORDER: Record<Severity, number> = {
  'Informational': 1,
  'Low': 2,
  'Medium': 3,
  'High': 4,
  'Critical': 5,
}

const IMPACT_ORDER: Record<Impact, number> = {
  'Low': 1,
  'Medium': 2,
  'High': 3,
  'Critical': 4,
}

const LIKELIHOOD_ORDER: Record<Likelihood, number> = {
  'Mitigated': 1,
  'Low': 2,
  'Medium': 3,
  'High': 4,
}

export function calculateLikelihoodFromGovernance(
  governance: GovernanceConfig,
  config: GovernanceLikelihoodConfiguration | LikelihoodMappingRule[]
): Likelihood {
  // Handle Dependency and Operator types
  if (governance.functionType === 'Dependency' && !Array.isArray(config) && governance.name) {
    return config.dependencies[governance.name] || 'High'
  }

  if (governance.functionType === 'Operator' && !Array.isArray(config) && governance.name) {
    return config.operators[governance.name] || 'High'
  }

  // Handle Admin type and legacy governance.type
  if (governance.functionType === 'Admin' || governance.functionType === undefined) {
    const governanceType = governance.governanceType || (governance as any).type
    const votingRules = Array.isArray(config) ? config : config.voting

    switch (governanceType) {
      case 'voting':
        // Check voting thresholds against mapping rules
        const delayDays = governance.votingDelayDays || 0
        const voters = governance.requiredVoters || 0

        // Find the highest likelihood that matches
        for (let i = 0; i < votingRules.length; i++) {
          const rule = votingRules[i]
          if (
            delayDays >= rule.votingMinDelayDays &&
            voters >= rule.votingMinVoters
          ) {
            return rule.likelihood
          }
        }
        return 'High' // Fallback

      case 'security_council':
        return Array.isArray(config) ? 'Medium' : config.security_council

      case 'multisig_delay_7d':
        return Array.isArray(config) ? 'Medium' : config.multisig_delay_7d

      case 'multisig':
        return Array.isArray(config) ? 'High' : config.multisig

      case 'eoa':
        return Array.isArray(config) ? 'High' : config.eoa

      default:
        return 'High'
    }
  }

  return 'High'
}

export function calculateRatingWithRules(
  entries: FunctionClassificationEntry[],
  rules: RatingRule[],
  mappingRules?: LikelihoodMappingRule[]
): FinalRating {
  if (entries.length === 0) return 'AAA'

  // Find highest severity and its associated highest impact
  let maxSeverity = 'Informational' as Severity
  let maxImpactForSeverity = 'Low' as Impact

  for (const entry of entries) {
    if (SEVERITY_ORDER[entry.severity] > SEVERITY_ORDER[maxSeverity]) {
      maxSeverity = entry.severity
      maxImpactForSeverity = entry.impact
    } else if (
      SEVERITY_ORDER[entry.severity] === SEVERITY_ORDER[maxSeverity] &&
      IMPACT_ORDER[entry.impact] > IMPACT_ORDER[maxImpactForSeverity]
    ) {
      maxImpactForSeverity = entry.impact
    }
  }

  // Find matching rule for the max severity and impact combination
  const matchingRule = rules.find(
    (rule) => rule.severity !== '' && rule.impact !== '' &&
              rule.severity === maxSeverity && rule.impact === maxImpactForSeverity
  )

  return matchingRule ? matchingRule.rating : 'AAA'
}

export function calculateSeverityFromGovernance(
  impact: Impact,
  governance: GovernanceConfig,
  severityMatrix: Record<Impact, Record<Likelihood, Severity>>,
  config: GovernanceLikelihoodConfiguration | LikelihoodMappingRule[],
  overrideLikelihood?: Likelihood
): Severity {
  const likelihood = overrideLikelihood ?? calculateLikelihoodFromGovernance(governance, config)
  return severityMatrix[impact][likelihood]
}

export function calculateRating(entries: FunctionClassificationEntry[]): FinalRating {
  if (entries.length === 0) return 'AAA'

  // Find highest severity and its associated highest impact
  let maxSeverity = 'Informational' as Severity
  let maxImpactForSeverity = 'Low' as Impact

  for (const entry of entries) {
    if (SEVERITY_ORDER[entry.severity] > SEVERITY_ORDER[maxSeverity]) {
      maxSeverity = entry.severity
      maxImpactForSeverity = entry.impact
    } else if (
      SEVERITY_ORDER[entry.severity] === SEVERITY_ORDER[maxSeverity] &&
      IMPACT_ORDER[entry.impact] > IMPACT_ORDER[maxImpactForSeverity]
    ) {
      maxImpactForSeverity = entry.impact
    }
  }

  // Determine rating based on severity and impact
  if (maxSeverity === 'Informational') return 'AA'
  if (maxSeverity === 'Low') return 'A'
  if (maxSeverity === 'Medium') {
    if (maxImpactForSeverity === 'Medium') return 'BBB'
    if (maxImpactForSeverity === 'High') return 'BB'
    if (maxImpactForSeverity === 'Critical') return 'B'
    return 'BBB'
  }
  if (maxSeverity === 'High') {
    if (maxImpactForSeverity === 'Medium') return 'CCC'
    if (maxImpactForSeverity === 'High') return 'CC'
    if (maxImpactForSeverity === 'Critical') return 'C'
    return 'CCC'
  }
  if (maxSeverity === 'Critical') return 'D'

  return 'AAA'
}
