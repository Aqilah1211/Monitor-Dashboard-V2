import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
  },
  {
    id: 'trouble',
    label: 'Troubles',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
  },
  {
    id: 'installed',
    label: 'Installed',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  {
    id: 'pending',
    label: 'Pending',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-9-9" /></svg>
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  }
];

export const Sidebar = memo(function Sidebar() {
  const { config, changeSheet, isLoading } = useApp();

  return (
    <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-white border-r border-slate-200 flex flex-col z-50">
      <div className="p-6 flex items-center gap-3 border-b border-slate-50">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 14a1 1 0 00-1 1v2a1 1 0 001 1h10a1 1 0 001-1v-2a1 1 0 00-1-1H7zM4 3a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z" />
          </svg>
        </div>
        <span className="hidden md:block font-bold text-xl tracking-tight text-slate-800">IFP Dashboard</span>
      </div>

      <nav className="flex-1 py-6 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.id}
            end={item.id === 'overview'}
            className={({ isActive }) =>
              `w-full flex items-center gap-4 px-6 py-3 transition-all ${
                isActive ? 'sidebar-item-active' : 'text-slate-500 hover:bg-slate-50'
              }`
            }
          >
            {item.icon}
            <span className="hidden md:block font-semibold">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-3">
        {config.sheetList.length > 1 && (
          <select
            value={config.currentSheet || ''}
            onChange={(e) => changeSheet(e.target.value)}
            className="w-full bg-blue-50 text-blue-600 font-bold text-xs px-3 py-2 rounded-lg border border-blue-100 outline-none hover:bg-blue-100 transition-all cursor-pointer"
            disabled={isLoading}
          >
            {config.sheetList.map((sheet) => (
              <option key={sheet} value={sheet}>Tab: {sheet}</option>
            ))}
          </select>
        )}
        
        <div className="glass-card px-3 py-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isLoading ? 'bg-blue-500' : 'bg-emerald-500'}`} />
            <span className="text-[10px] font-bold text-emerald-600 uppercase text-center">
              {isLoading ? 'Syncing...' : 'Live Sync On'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
});
