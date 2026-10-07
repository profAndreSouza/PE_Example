import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { UsuariosPage } from './pages/UsuariosPage';
import { ProjetosPage } from './pages/ProjetosPage';

export function App() {
  const [activeTab, setActiveTab] = useState<'usuarios' | 'projetos'>('usuarios');

  return (
    <div className="min-vh-100 bg-light">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {activeTab === 'usuarios' ? <UsuariosPage /> : <ProjetosPage />}
      </main>
    </div>
  );
}

export default App;
