import React, { useState } from 'react';
import { ASSETS } from '../constants/assets';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const roleLabels: Record<UserRole, { label: string; sub: string }> = {
    administrador: { label: 'Administrador', sub: 'Acesso Total' },
    gestor: { label: 'Gestor', sub: 'Aprovação & Alçadas' },
    operacional: { label: 'Operacional', sub: 'Cadastro & Consulta' },
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#131b2e] z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.1)] select-none">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="h-16 px-4 flex items-center gap-2.5 bg-[#131b2e]/95 border-b border-white/5 cursor-pointer hover:bg-white/[0.02] transition-colors"
        >
          {!logoError ? (
            <img
              alt="ContractFlow Logo"
              className="h-8 w-auto object-contain shrink-0"
              src={ASSETS.logo}
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#0051d5] flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-[17px] font-bold text-white tracking-tight leading-tight">ContractFlow</span>
            <span className="text-[10px] text-[#7c839b] uppercase tracking-wider font-semibold">Enterprise CLM</span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-3">
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#316bf3] text-white font-semibold shadow-sm'
                  : 'text-[#7c839b] hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('fornecedores')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${
                activeTab === 'fornecedores'
                  ? 'bg-[#316bf3] text-white font-semibold shadow-sm'
                  : 'text-[#7c839b] hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">domain</span>
              <span>Fornecedores</span>
            </button>

            <button
              onClick={() => setActiveTab('contratos')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${
                activeTab === 'contratos' || activeTab === 'contrato_detalhe'
                  ? 'bg-[#316bf3] text-white font-semibold shadow-sm'
                  : 'text-[#7c839b] hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">description</span>
              <span>Contratos</span>
            </button>

            <button
              onClick={() => setActiveTab('configuracoes')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${
                activeTab === 'configuracoes'
                  ? 'bg-[#316bf3] text-white font-semibold shadow-sm'
                  : 'text-[#7c839b] hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span>Configurações</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Role Permission Selector at Bottom */}
      <div className="p-3 bg-black/20 border-t border-white/5 relative">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] text-[#7c839b] uppercase tracking-wider font-semibold">Nível de Permissão</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-[#316bf3] text-white">
              Ativo
            </span>
          </div>

          <div
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center justify-between p-2 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#dbe1ff] text-[20px]">shield_person</span>
              <div className="flex flex-col text-left">
                <span className="text-[12px] font-semibold text-white">{roleLabels[currentRole].label}</span>
                <span className="text-[10px] text-[#7c839b]">{roleLabels[currentRole].sub}</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#7c839b] text-[18px]">unfold_more</span>
          </div>

          {/* Role Dropdown */}
          {showRoleMenu && (
            <div className="absolute bottom-16 left-3 right-3 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-1">
              <div className="px-2 py-1 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Alternar Papel</div>
              {(['administrador', 'gestor', 'operacional'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setCurrentRole(r);
                    setShowRoleMenu(false);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12px] transition-colors text-left ${
                    currentRole === r ? 'bg-[#316bf3] text-white font-semibold' : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{roleLabels[r].label}</span>
                    <span className="text-[10px] opacity-75">{roleLabels[r].sub}</span>
                  </div>
                  {currentRole === r && <span className="material-symbols-outlined text-[16px]">check</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
