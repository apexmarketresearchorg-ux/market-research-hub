import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminDashboard from '@/components/AdminDashboard';

export default function Admin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Admin Dashboard</h1>
          <button
            onClick={() => signIn()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return <AdminDashboard />;
  }

  return <div>Loading...</div>;
}
