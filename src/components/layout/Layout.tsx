import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="ml-20 md:ml-64 p-4 md:p-8 transition-all">
        <Header />
        {children}
      </main>
    </div>
  );
}
