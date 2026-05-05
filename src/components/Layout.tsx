import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />

      <div className="flex pt-14 h-screen">
        <Sidebar open={sidebarOpen} />

        <main
          className="flex-1 overflow-hidden transition-all duration-300"
          style={{ marginLeft: sidebarOpen ? 256 : 0 }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
