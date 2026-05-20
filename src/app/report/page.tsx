import ReportViewer from "@/components/report/ReportViewer";
import ReportHeader from "@/components/report/ReportHeader";
import { Suspense } from "react";
import { getReportData } from "@/lib/report-actions";
import { mockReportData } from "@/lib/mock-report-data";
import { redirect } from "next/navigation";

export default async function ReportPage({
    searchParams,
}: {
    searchParams: { profile?: string; print?: string; resultId?: string; mock?: string };
}) {
    const isPrinting = searchParams.print === "true";
    const isMock = searchParams.mock === "true";

    // 1. For mock/demo mode, show mock data immediately without auth
    if (isMock) {
        const profile = searchParams.profile || "engineering-student";
        const data = mockReportData[profile] ?? mockReportData["engineering-student"];
        return (
            <div className="bg-[#030712] min-h-screen">
                <ReportHeader isPrinting={isPrinting} />
                <div className={isPrinting ? '' : 'pt-20'}>
                    <ReportViewer data={data} isPrinting={isPrinting} />
                </div>
            </div>
        );
    }

    // 2. Try to get real data
    let data = await getReportData(searchParams.resultId);

    // 3. Fallback to named profile mock (for demo/development)
    if (!data && searchParams.profile) {
        data = mockReportData[searchParams.profile] || mockReportData["engineering-student"];
    }

    // 4. If still no data, redirect to dashboard
    if (!data) redirect("/dashboard?error=no-result");

    // 5. Unreachable safety net
    if (!data) return <div className="p-20 text-white">No intelligence data found.</div>;

    return (
        <div className="bg-[#030712] min-h-screen">
            <ReportHeader isPrinting={isPrinting} />
            <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-mono tracking-widest text-xs uppercase opacity-50">Decoding Dossier Persistence...</div>}>
                <div className={isPrinting ? '' : 'pt-20'}>
                    <ReportViewer data={data} isPrinting={isPrinting} />
                </div>
            </Suspense>
        </div>
    );
}
