import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="container-custom mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
          Dashboard
        </h1>
        
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-gameon-blue-100 flex items-center justify-center text-gameon-blue-600 font-bold text-2xl">
              {session.user?.name?.[0] || "U"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Welcome, {session.user?.name}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                {session.user?.email}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Account Role</h3>
                <p className="text-lg font-medium text-slate-900 dark:text-white">{(session.user as any).role}</p>
             </div>
             <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">User ID</h3>
                <p className="font-mono text-sm text-slate-600 dark:text-slate-400">{(session.user as any).id}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
