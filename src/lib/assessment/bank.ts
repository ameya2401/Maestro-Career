import { AssessmentBank } from "@/lib/assessment/types";
import { PROTOTYPE_1_V1 } from "@/lib/assessment/banks/prototype-1-v1";

export const INTERNAL_BANK_VERSION_V1 = "prototype-1-v1";

export function getAssessmentBankByVersion(version: string): AssessmentBank {
    if (version === PROTOTYPE_1_V1.version) return PROTOTYPE_1_V1;
    return PROTOTYPE_1_V1;
}
