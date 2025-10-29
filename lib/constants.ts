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
    Low: "Informational",
    Medium: "Low",
    High: "Medium",
  },
  Medium: {
    Mitigated: "Informational",
    Low: "Low",
    Medium: "Medium",
    High: "High",
  },
  High: {
    Mitigated: "Low",
    Low: "Medium",
    Medium: "High",
    High: "Critical",
  },
  Critical: {
    Mitigated: "Medium",
    Low: "High",
    Medium: "Critical",
    High: "Critical",
  },
};

// Flat array structure for displaying/editing the matrix
export const DEFAULT_SEVERITY_MATRIX_FLAT: SeverityMatrixEntry[] = [
  { impact: "Low", likelihood: "Mitigated", severity: "Informational" },
  { impact: "Low", likelihood: "Low", severity: "Informational" },
  { impact: "Low", likelihood: "Medium", severity: "Low" },
  { impact: "Low", likelihood: "High", severity: "Medium" },
  { impact: "Medium", likelihood: "Mitigated", severity: "Informational" },
  { impact: "Medium", likelihood: "Low", severity: "Low" },
  { impact: "Medium", likelihood: "Medium", severity: "Medium" },
  { impact: "Medium", likelihood: "High", severity: "High" },
  { impact: "High", likelihood: "Mitigated", severity: "Low" },
  { impact: "High", likelihood: "Low", severity: "Medium" },
  { impact: "High", likelihood: "Medium", severity: "High" },
  { impact: "High", likelihood: "High", severity: "Critical" },
  { impact: "Critical", likelihood: "Mitigated", severity: "Medium" },
  { impact: "Critical", likelihood: "Low", severity: "High" },
  { impact: "Critical", likelihood: "Medium", severity: "Critical" },
  { impact: "Critical", likelihood: "High", severity: "Critical" },
];

export const FINAL_RATINGS: FinalRatingEntry[] = [
  {
    rating: "AAA",
    scores: "Immutable and autonomous",
    description: "No Admins, Dependencies or Operators identified",
  },
  {
    rating: "AA",
    scores: "Informational Severity risks",
    description: "Centralization risks are Informational only.",
  },
  {
    rating: "A",
    scores: "Low Severity risks",
    description:
      "Centralization risks are Low, not exposing High or Critical Impact threat vectors.",
  },
  {
    rating: "BBB",
    scores: "Medium Severity risks with Medium Impact",
    description:
      "Centralization risks are Medium based on a Medium Impact threat vector.",
  },
  {
    rating: "BB",
    scores: "Medium Severity risks with High Impact",
    description:
      "Centralization risks are Medium based on a High Impact threat vector.",
  },
  {
    rating: "B",
    scores: "Medium Severity risks with Critical Impact",
    description:
      "Centralization risks are Medium based on a Critical Impact threat vector.",
  },
  {
    rating: "CCC",
    scores: "High Severity risks with Medium Impact",
    description:
      "Centralization risks are High based on a Medium Impact threat vector.",
  },
  {
    rating: "CC",
    scores: "High Severity risks with High Impact",
    description:
      "Centralization risks are High based on a High Impact threat vector.",
  },
  {
    rating: "C",
    scores: "High Severity risks with Critical Impact",
    description:
      "Centralization risks are High based on a Critical Impact threat vector.",
  },
  {
    rating: "D",
    scores: "Critical Severity risks",
    description: "Centralization risks are Critical.",
  },
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
  // A: Low severity with Low or Medium impact
  {
    id: "4",
    rating: "A",
    severity: "Low",
    impact: "Low",
    description: "Low Severity risks",
  },
  {
    id: "5",
    rating: "A",
    severity: "Low",
    impact: "Medium",
    description: "Low Severity risks",
  },
  // BBB: Medium severity with Low or Medium impact
  {
    id: "6",
    rating: "BBB",
    severity: "Medium",
    impact: "Low",
    description: "Medium Severity risks with Low Impact",
  },
  {
    id: "7",
    rating: "BBB",
    severity: "Medium",
    impact: "Medium",
    description: "Medium Severity risks with Medium Impact",
  },
  // BB: Medium severity with High impact
  {
    id: "8",
    rating: "BB",
    severity: "Medium",
    impact: "High",
    description: "Medium Severity risks with High Impact",
  },
  // B: Medium severity with Critical impact
  {
    id: "9",
    rating: "B",
    severity: "Medium",
    impact: "Critical",
    description: "Medium Severity risks with Critical Impact",
  },
  // CCC: High severity with Low or Medium impact
  {
    id: "10",
    rating: "CCC",
    severity: "High",
    impact: "Low",
    description: "High Severity risks with Low Impact",
  },
  {
    id: "11",
    rating: "CCC",
    severity: "High",
    impact: "Medium",
    description: "High Severity risks with Medium Impact",
  },
  // CC: High severity with High impact
  {
    id: "12",
    rating: "CC",
    severity: "High",
    impact: "High",
    description: "High Severity risks with High Impact",
  },
  // C: High severity with Critical impact
  {
    id: "13",
    rating: "C",
    severity: "High",
    impact: "Critical",
    description: "High Severity risks with Critical Impact",
  },
  // D: Critical severity (all impacts)
  {
    id: "14",
    rating: "D",
    severity: "Critical",
    impact: "Low",
    description: "Critical Severity risks",
  },
  {
    id: "15",
    rating: "D",
    severity: "Critical",
    impact: "Medium",
    description: "Critical Severity risks",
  },
  {
    id: "16",
    rating: "D",
    severity: "Critical",
    impact: "High",
    description: "Critical Severity risks",
  },
  {
    id: "17",
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
    description:
      "Trustless Voting with total Delay ≥ 7 days and Consensus Threshold ≥ 20 voters",
  },
  {
    likelihood: "Low",
    votingMinDelayDays: 4,
    votingMinVoters: 10,
    description:
      "Trustless Voting with total Delay ≥ 4 days and Consensus Threshold ≥ 10 voters",
  },
  {
    likelihood: "Medium",
    votingMinDelayDays: 2,
    votingMinVoters: 5,
    description:
      "Trustless Voting with total Delay ≥ 2 days and Consensus Threshold ≥ 5 voters, OR Security Council, OR Multisig with Delay ≥ 7 days",
  },
  {
    likelihood: "High",
    votingMinDelayDays: 0,
    votingMinVoters: 0,
    description: "Insignificant Voting control",
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
  };

// Backward compatibility export for voting rules only
export const DEFAULT_LIKELIHOOD_MAPPING_RULES: LikelihoodMappingRule[] =
  DEFAULT_VOTING_LIKELIHOOD_RULES;
