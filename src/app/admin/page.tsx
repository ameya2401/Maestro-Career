import { Metadata } from 'next';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

export const metadata: Metadata = {
    title: 'Admin Dashboard | Maestro Career',
    description: 'Analytics and platform overview for administrators.',
};

export default function AdminPage() {
    return (
        <div className="bg-slate-50 min-h-screen">
            <AnalyticsDashboard />
        </div>
    );
}
