import {
  SeverityMatrixEntry,
  FinalRatingEntry,
  Impact,
  Likelihood,
  Severity,
  RatingRule,
  StageEntry,
  LikelihoodMappingRule,
  GovernanceLikelihoodConfiguration,
} from "./types";

// 2D structure for fast lookups: severityMatrix[impact][likelihood]
export const DEFAULT_SEVERITY_MATRIX_2D: Record<
  Impact,
  Record<Likelihood, Severity>
> = {
  Low: {
    Mitigated: "Informational",
    Low: "Low",
    Medium: "Low",
    High: "Low",
  },
  Medium: {
    Mitigated: "Informational",
    Low: "Low",
    Medium: "Medium",
    High: "Medium",
  },
  High: {
    Mitigated: "Informational",
    Low: "Low",
    Medium: "Medium",
    High: "High",
  },
  Critical: {
    Mitigated: "Informational",
    Low: "Medium",
    Medium: "High",
    High: "Critical",
  },
};

// Flat array structure for displaying/editing the matrix
export const DEFAULT_SEVERITY_MATRIX_FLAT: SeverityMatrixEntry[] = [
  { impact: "Low", likelihood: "Mitigated", severity: "Informational" },
  { impact: "Low", likelihood: "Low", severity: "Low" },
  { impact: "Low", likelihood: "Medium", severity: "Low" },
  { impact: "Low", likelihood: "High", severity: "Low" },
  { impact: "Medium", likelihood: "Mitigated", severity: "Informational" },
  { impact: "Medium", likelihood: "Low", severity: "Low" },
  { impact: "Medium", likelihood: "Medium", severity: "Medium" },
  { impact: "Medium", likelihood: "High", severity: "Medium" },
  { impact: "High", likelihood: "Mitigated", severity: "Informational" },
  { impact: "High", likelihood: "Low", severity: "Low" },
  { impact: "High", likelihood: "Medium", severity: "Medium" },
  { impact: "High", likelihood: "High", severity: "High" },
  { impact: "Critical", likelihood: "Mitigated", severity: "Informational" },
  { impact: "Critical", likelihood: "Low", severity: "Medium" },
  { impact: "Critical", likelihood: "Medium", severity: "High" },
  { impact: "Critical", likelihood: "High", severity: "Critical" },
];

export const IMPACTS = ["Low", "Medium", "High", "Critical"] as const;
export const LIKELIHOODS = ["Mitigated", "Low", "Medium", "High"] as const;
export const SEVERITIES = [
  "Informational",
  "Low",
  "Medium",
  "High",
  "Critical",
] as const;

// Default rating rules: Maps (Severity, Impact) combinations to final ratings
// Only displays the minimum necessary combinations in the editable table
// The actual logic determines which rule applies based on the worst-case severity/impact
export const DEFAULT_RATING_RULES: RatingRule[] = [
  // AAA: No entries/empty project (placeholder row)
  {
    id: "1",
    rating: "AAA",
    severity: "",
    impact: "",
    description: "Immutable and autonomous",
  },
  // AA: Informational severity with Low or Medium impact
  {
    id: "2",
    rating: "AA",
    severity: "Informational",
    impact: "Low",
    description: "Informational Severity risks",
  },
  {
    id: "3",
    rating: "AA",
    severity: "Informational",
    impact: "Medium",
    description: "Informational Severity risks",
  },
  {
    id: "4",
    rating: "AA",
    severity: "Informational",
    impact: "High",
    description: "Informational Severity risks",
  },
  {
    id: "5",
    rating: "AA",
    severity: "Informational",
    impact: "Critical",
    description: "Informational Severity risks",
  },
  // A: Low severity with Low or Medium impact
  {
    id: "6",
    rating: "A",
    severity: "Low",
    impact: "Low",
    description: "Low Severity risks",
  },
  {
    id: "7",
    rating: "A",
    severity: "Low",
    impact: "Medium",
    description: "Low Severity risks",
  },
  {
    id: "8",
    rating: "A",
    severity: "Low",
    impact: "High",
    description: "Low Severity risks",
  },
  {
    id: "9",
    rating: "A",
    severity: "Low",
    impact: "Critical",
    description: "Low Severity risks",
  },
  // BBB: Medium severity with Low or Medium impact
  {
    id: "10",
    rating: "BBB",
    severity: "Medium",
    impact: "Low",
    description: "Medium Severity risks with Low Impact",
  },
  {
    id: "11",
    rating: "BBB",
    severity: "Medium",
    impact: "Medium",
    description: "Medium Severity risks with Medium Impact",
  },
  // BB: Medium severity with High impact
  {
    id: "12",
    rating: "BB",
    severity: "Medium",
    impact: "High",
    description: "Medium Severity risks with High Impact",
  },
  // B: Medium severity with Critical impact
  {
    id: "13",
    rating: "B",
    severity: "Medium",
    impact: "Critical",
    description: "Medium Severity risks with Critical Impact",
  },
  // CCC: High severity with Low or Medium impact
  {
    id: "14",
    rating: "CCC",
    severity: "High",
    impact: "Low",
    description: "High Severity risks with Low Impact",
  },
  {
    id: "15",
    rating: "CCC",
    severity: "High",
    impact: "Medium",
    description: "High Severity risks with Medium Impact",
  },
  // CC: High severity with High impact
  {
    id: "16",
    rating: "CC",
    severity: "High",
    impact: "High",
    description: "High Severity risks with High Impact",
  },
  // C: High severity with Critical impact
  {
    id: "17",
    rating: "C",
    severity: "High",
    impact: "Critical",
    description: "High Severity risks with Critical Impact",
  },
  // D: Critical severity (all impacts)
  {
    id: "18",
    rating: "D",
    severity: "Critical",
    impact: "Low",
    description: "Critical Severity risks",
  },
  {
    id: "19",
    rating: "D",
    severity: "Critical",
    impact: "Medium",
    description: "Critical Severity risks",
  },
  {
    id: "20",
    rating: "D",
    severity: "Critical",
    impact: "High",
    description: "Critical Severity risks",
  },
  {
    id: "21",
    rating: "D",
    severity: "Critical",
    impact: "Critical",
    description: "Critical Severity risks",
  },
];

// Helper function to convert 2D to flat (in case matrix is modified)
export function matrix2DToFlat(
  matrix: Record<Impact, Record<Likelihood, Severity>>
): SeverityMatrixEntry[] {
  const flat: SeverityMatrixEntry[] = [];
  for (const impact of IMPACTS) {
    for (const likelihood of LIKELIHOODS) {
      flat.push({
        impact,
        likelihood,
        severity: matrix[impact][likelihood],
      });
    }
  }
  return flat;
}

// Helper function to convert flat to 2D (in case matrix is modified)
export function matrixFlatTo2D(
  flat: SeverityMatrixEntry[]
): Record<Impact, Record<Likelihood, Severity>> {
  const matrix = { ...DEFAULT_SEVERITY_MATRIX_2D };
  for (const entry of flat) {
    matrix[entry.impact][entry.likelihood] = entry.severity;
  }
  return matrix;
}

// Stage entries for protocol/project classification
export const STAGE_ENTRIES: StageEntry[] = [
  // Stage 2: Established protocols
  { id: "1", name: "Liquity V1", stage: "Stage 2" },
  { id: "2", name: "Uniswap V3", stage: "Stage 2" },
  { id: "3", name: "Uniswap V2", stage: "Stage 2" },
  // Stage 1: Growing protocols
  { id: "4", name: "Ajna", stage: "Stage 1" },
  { id: "5", name: "Aerodrome", stage: "Stage 1" },
  { id: "6", name: "Velodrome", stage: "Stage 1" },
  { id: "7", name: "Morpho", stage: "Stage 1" },
  // Stage 0: Newer/experimental protocols
  { id: "8", name: "Lido", stage: "Stage 0" },
  { id: "9", name: "Aave V3", stage: "Stage 0" },
  { id: "10", name: "Spark", stage: "Stage 0" },
  { id: "11", name: "Pendle", stage: "Stage 0" },
];

// Likelihood mapping rules for voting governance type
const DEFAULT_VOTING_LIKELIHOOD_RULES: LikelihoodMappingRule[] = [
  {
    likelihood: "Mitigated",
    votingMinDelayDays: 7,
    votingMinVoters: 20,
  },
  {
    likelihood: "Low",
    votingMinDelayDays: 4,
    votingMinVoters: 10,
  },
  {
    likelihood: "Medium",
    votingMinDelayDays: 2,
    votingMinVoters: 5,
  },
  {
    likelihood: "High",
    votingMinDelayDays: 0,
    votingMinVoters: 0,
  },
];

// Governance likelihood configuration with default values for each governance type
export const DEFAULT_GOVERNANCE_LIKELIHOOD_CONFIG: GovernanceLikelihoodConfiguration =
  {
    voting: DEFAULT_VOTING_LIKELIHOOD_RULES,
    eoa: "High",
    multisig: "High",
    multisig_delay_7d: "Medium",
    security_council: "Medium",
    dependencies: {
      chainlink_tellor: "Mitigated",
      chainlink: "Low",
      chronicle: "Low",
      sky: "High",
    },
    operators: {},
  };

// Backward compatibility export for voting rules only
export const DEFAULT_LIKELIHOOD_MAPPING_RULES: LikelihoodMappingRule[] =
  DEFAULT_VOTING_LIKELIHOOD_RULES;
