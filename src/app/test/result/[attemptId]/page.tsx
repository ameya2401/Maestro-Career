import ResultPageClient from "./ResultPageClient";

export const dynamic = "force-dynamic";

export default function TestResultPage({ params }: { params: { attemptId: string } }) {
    return <ResultPageClient attemptId={params.attemptId} />;
}
