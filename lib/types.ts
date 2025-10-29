export type Impact = "Low" | "Medium" | "High" | "Critical";
export type Likelihood = "Mitigated" | "Low" | "Medium" | "High";
export type Severity = "Informational" | "Low" | "Medium" | "High" | "Critical";
export type FinalRating =
  | "D"
  | "C"
  | "CC"
  | "CCC"
  | "B"
  | "BB"
  | "BBB"
  | "A"
  | "AA"
  | "AAA";

export interface SeverityMatrixEntry {
  impact: Impact;
  likelihood: Likelihood;
  severity: Severity;
}

export interface FunctionClassificationEntry {
  id: string;
  function: string;
  impact: Impact;
  governance: GovernanceConfig;
  severity: Severity;
}

export interface FunctionClassificationTable {
  id: string;
  title: string;
  entries: FunctionClassificationEntry[];
}

export interface FinalRatingEntry {
  rating: FinalRating;
  scores: string;
  description: string;
  maxSeverity?: Severity;
  minImpact?: Impact;
}

export interface RatingRule {
  id: string;
  rating: FinalRating;
  severity: Severity | "";
  impact: Impact | "";
  description: string;
}

export type Stage = "Stage 2" | "Stage 1" | "Stage 0";

export interface StageEntry {
  id: string;
  name: string;
  stage: Stage;
}

export type GovernanceType =
  | "voting"
  | "multisig_delay_7d"
  | "security_council"
  | "eoa"
  | "multisig";

export interface GovernanceConfig {
  type: GovernanceType;
  votingDelayDays?: number;
  requiredVoters?: number;
}

export interface LikelihoodMappingRule {
  likelihood: Likelihood;
  votingMinDelayDays: number;
  votingMinVoters: number;
}

export interface GovernanceLikelihoodConfiguration {
  voting: LikelihoodMappingRule[];
  eoa: Likelihood;
  multisig: Likelihood;
  multisig_delay_7d: Likelihood;
  security_council: Likelihood;
}
