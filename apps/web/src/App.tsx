import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import ConnectAccount from "./components/ConnectAccount.tsx";
import Debugger from "./pages/Debugger.tsx";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Templates from "./pages/Templates";
import Analytics from "./pages/Analytics";
import { useWalletBalance } from "./hooks/useWalletBalance";
import { useWallet } from "./hooks/useWallet";

const AppLayout: React.FC = () => {
  const { address } = useWallet();
  const { usdc, isLoading: balanceLoading } = useWalletBalance();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar with Wallet Connect */}
      <header style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--color-primary)',
          margin: 0
        }}>
          LockedIn
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {address && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              marginRight: '12px'
            }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)' }}>
                {balanceLoading ? '...' : usdc} USDC
              </span>
            </div>
          )}
          <ConnectAccount />
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/debug" element={<Debugger />} />
        <Route path="/debug/:contractName" element={<Debugger />} />
      </Route>
    </Routes>
  );
}

export default App;
