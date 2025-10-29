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
  likelihood: Likelihood;
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
