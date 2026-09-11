import { AgroProvider, useAgro } from './agroCore.js';
import Header from './components/Header.jsx';
import Tabs from './components/Tabs.jsx';
import AuthPage from './components/AuthPage.jsx';
import HomePage from './components/HomePage.jsx';
import PricingPage from './components/PricingPage.jsx';
import ProductsPage from './components/ProductsPage.jsx';
import MachinesPage from './components/MachinesPage.jsx';
import DashboardPage from './components/DashboardPage.jsx';

function AgroApp() {
  const { state } = useAgro();

  const pageByTab = {
    inicio: <HomePage />,
    precificacao: <PricingPage />,
    produtos: <ProductsPage />,
    maquinas: <MachinesPage />,
    painel: <DashboardPage />
  };

  return (
    <div className="page-background">
      <div className="main-container">
        {!state.auth ? (
          <div className="auth-shell">
            <AuthPage />
          </div>
        ) : (
          <>
            <Header />
            <Tabs />
            <main className="page-wrap">
              {pageByTab[state.activeTab] || <HomePage />}
            </main>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AgroProvider>
      <AgroApp />
    </AgroProvider>
  );
}

