import React from 'react';

interface NavbarProps {
  activeTab: 'usuarios' | 'projetos';
  setActiveTab: (tab: 'usuarios' | 'projetos') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
      <div className="container">
        <a className="navbar-brand fw-bold" href="#">
          🎓 PE Example — Plataforma Digital
        </a>
        <div className="navbar-nav ms-auto">
          <button
            className={`btn btn-link nav-link ${activeTab === 'usuarios' ? 'active fw-bold border-bottom border-2 border-white' : ''}`}
            onClick={() => setActiveTab('usuarios')}
          >
            👥 Gestão de Usuários
          </button>
          <button
            className={`btn btn-link nav-link ms-2 ${activeTab === 'projetos' ? 'active fw-bold border-bottom border-2 border-white' : ''}`}
            onClick={() => setActiveTab('projetos')}
          >
            📋 Projetos de Extensão
          </button>
        </div>
      </div>
    </nav>
  );
};
