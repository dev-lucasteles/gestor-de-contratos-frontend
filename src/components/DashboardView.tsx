import React, { useState } from 'react';
import { UserRole } from '../types';

interface DashboardViewProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  onNavigateContract: (code: string) => void;
  onNavigateSettings: () => void;
  onNavigateNewContract: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentRole,
  setCurrentRole,
  onNavigateContract,
  onNavigateSettings,
}) => {
  const [dateRange, setDateRange] = useState('Últimos 30 dias');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="p-6 flex flex-col gap-6 w-full max-w-[1600px] mx-auto animate-in fade-in duration-300">
        {/* Top Greeting & Global Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-[28px] font-bold text-[#0b1c30] tracking-tight leading-none">
                Olá, Carlos!
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#eff4ff] text-[#0051d5] text-[12px] font-semibold border border-[#dce9ff]">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                Visão Geral Atualizada
              </span>
            </div>
            <p className="text-[14px] text-[#45464d] mt-1.5">
              Aqui está o panorama dos seus contratos hoje. Quarta-feira, 24 de Outubro de 2025 •{' '}
              <span className="text-[12px] font-semibold text-[#0051d5] cursor-pointer hover:underline">
                3 alertas críticos demandando ação
              </span>
            </p>
          </div>

          {/* Controls & Perspective Selector */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Profile Perspective Segmented Pill */}
            <div className="flex items-center p-1 bg-[#eff4ff] rounded-xl border border-[#dce9ff]/60 shadow-sm">
              <button
                type="button"
                onClick={() => setCurrentRole('administrador')}
                className={`px-3 py-1 rounded-lg text-[12px] font-semibold transition-all flex items-center gap-1 ${
                  currentRole === 'administrador'
                    ? 'bg-white text-[#0b1c30] shadow-sm'
                    : 'text-[#45464d] hover:text-[#0b1c30]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-[#0051d5]">admin_panel_settings</span>
                <span>Administrador</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentRole('gestor')}
                className={`px-3 py-1 rounded-lg text-[12px] font-semibold transition-all flex items-center gap-1 ${
                  currentRole === 'gestor'
                    ? 'bg-white text-[#0b1c30] shadow-sm'
                    : 'text-[#45464d] hover:text-[#0b1c30]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-[#0051d5]">how_to_reg</span>
                <span>Gestor</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentRole('operacional')}
                className={`px-3 py-1 rounded-lg text-[12px] font-semibold transition-all flex items-center gap-1 ${
                  currentRole === 'operacional'
                    ? 'bg-white text-[#0b1c30] shadow-sm'
                    : 'text-[#45464d] hover:text-[#0b1c30]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-[#0051d5]">engineering</span>
                <span>Operacional</span>
              </button>
            </div>

            {/* Date Range Filter */}
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value);
                  showToast(`Filtro atualizado: ${e.target.value}`);
                }}
                className="h-9 px-3 pr-8 rounded-xl bg-white text-[#0b1c30] text-[13px] font-medium shadow-sm border border-[#e5eeff] hover:bg-[#eff4ff] transition-colors focus:outline-none appearance-none cursor-pointer"
              >
                <option>Últimos 30 dias</option>
                <option>Último Trimestre</option>
                <option>Ano Vigente (2025)</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2 text-[#76777d] pointer-events-none text-[16px]">
                expand_more
              </span>
            </div>

            {/* Executive Export Button */}
            <button
              type="button"
              onClick={() => showToast('Relatório Executivo exportado em PDF com sucesso!')}
              className="h-9 px-3.5 rounded-xl bg-[#0b1c30] text-white text-[13px] font-medium shadow-sm hover:bg-[#131b2e] active:scale-[0.98] transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Relatório Executivo</span>
            </button>
          </div>
        </div>

        {/* KPI Summary Grid (4 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Card 1: Total Active */}
          <div className="p-4 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider text-[#45464d] font-semibold">
                  Contratos Ativos
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-[34px] font-bold text-[#0b1c30] tracking-tight leading-none">284</span>
                  <span className="text-[12px] text-[#45464d]">unidades</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#0051d5]">
                <span className="material-symbols-outlined text-[22px]">assignment_turned_in</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-50">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669] text-[12px] font-semibold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                <span>+12.4% este mês</span>
              </div>
              <span className="text-[11px] text-[#45464d]">97.2% em conformidade</span>
            </div>
          </div>

          {/* Card 2: Expiring Soon (Warning Amber) */}
          <div className="p-4 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] uppercase tracking-wider text-[#b45309] font-semibold">
                    A Vencer (30/60 dias)
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#d97706] animate-pulse"></span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-[34px] font-bold text-[#9a3412] tracking-tight leading-none">18</span>
                  <span className="text-[12px] font-semibold text-[#b45309]">em risco</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#fffbeb] flex items-center justify-center text-[#d97706]">
                <span className="material-symbols-outlined text-[22px]">notification_important</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mt-4 pt-1">
              <div className="flex justify-between text-[11px] text-[#45464d]">
                <span>7 em 30 dias • 11 em 60 dias</span>
                <span className="text-[12px] text-[#0b1c30] font-bold">R$ 1.45M</span>
              </div>
              <div className="w-full h-1.5 bg-[#eff4ff] rounded-full overflow-hidden">
                <div className="h-full bg-[#f59e0b] rounded-full" style={{ width: '61%' }}></div>
              </div>
            </div>
          </div>

          {/* Card 3: Pending Signatures (Critical Red) */}
          <div className="p-4 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] uppercase tracking-wider text-[#ba1a1a] font-semibold">
                    Sem Assinatura
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-[#ffdad6] text-[#ba1a1a] text-[10px] uppercase font-bold">
                    Atraso
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-[34px] font-bold text-[#ba1a1a] tracking-tight leading-none">9</span>
                  <span className="text-[12px] font-medium text-[#ba1a1a]/80">bloqueados</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#ffdad6]/40 flex items-center justify-center text-[#ba1a1a]">
                <span className="material-symbols-outlined text-[22px]">edit_document</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-50">
              <span className="text-[11px] text-[#45464d]">Média de 8.4 dias em espera</span>
              <button
                type="button"
                onClick={() => showToast('Notificação e cobrança disparada para 9 signatários!')}
                className="px-2.5 py-1 rounded-lg bg-[#ba1a1a] text-white text-[12px] font-semibold hover:bg-[#991b1b] active:scale-[0.98] transition-all flex items-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-[14px]">send</span>
                Cobrar Assinaturas
              </button>
            </div>
          </div>

          {/* Card 4: Total Value Under Management */}
          <div className="p-4 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider text-[#45464d] font-semibold">
                  Valor Total Sob Gestão
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-[34px] font-bold text-[#0b1c30] tracking-tight leading-none">
                    R$ 34,8M
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#0051d5]">
                <span className="material-symbols-outlined text-[22px]">account_balance</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-50">
              <span className="text-[12px] text-[#45464d]">
                Vigência Média: <strong className="text-[#0b1c30]">18 meses</strong>
              </span>
              <span className="text-[11px] text-[#059669] font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">savings</span>
                R$ 820k otimizados
              </span>
            </div>
          </div>
        </div>

        {/* Main Analytics & Operational Section (2-Column Bento) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Widget 1: Donut Chart Distribution (5 Columns) */}
          <div className="lg:col-span-5 p-5 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <h2 className="text-[18px] font-bold text-[#0b1c30] tracking-tight">
                  Distribuição de Status
                </h2>
                <span className="text-[11px] text-[#45464d]">Base global consolidada de 364 contratos</span>
              </div>
              <button
                type="button"
                onClick={() => showToast('Visualização de filtros de status')}
                className="p-1.5 rounded-lg text-[#45464d] hover:bg-[#eff4ff] transition-colors"
                title="Filtrar"
              >
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
              </button>
            </div>

            {/* SVG Donut Chart + Central Stats */}
            <div className="relative flex items-center justify-center my-3">
              <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 160 160">
                {/* Background circle */}
                <circle cx="80" cy="80" fill="none" r="62" stroke="#eff4ff" strokeWidth="16" />
                {/* 78% Active (Emerald: #059669) -> Circumference ~389.5 -> 78% = 303.8 */}
                <circle
                  cx="80"
                  cy="80"
                  fill="none"
                  r="62"
                  stroke="#059669"
                  strokeDasharray="303.8 389.5"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  strokeWidth="16"
                />
                {/* 14% Expiring (Amber: #d97706) -> 14% = 54.5 */}
                <circle
                  cx="80"
                  cy="80"
                  fill="none"
                  r="62"
                  stroke="#d97706"
                  strokeDasharray="54.5 389.5"
                  strokeDashoffset="-306"
                  strokeLinecap="round"
                  strokeWidth="16"
                />
                {/* 5% Unsigned (Crimson: #dc2626) -> 5% = 19.5 */}
                <circle
                  cx="80"
                  cy="80"
                  fill="none"
                  r="62"
                  stroke="#dc2626"
                  strokeDasharray="19.5 389.5"
                  strokeDashoffset="-362"
                  strokeLinecap="round"
                  strokeWidth="16"
                />
                {/* 3% Expired/Renewing (Slate: #76777d) -> 3% = 11.7 */}
                <circle
                  cx="80"
                  cy="80"
                  fill="none"
                  r="62"
                  stroke="#76777d"
                  strokeDasharray="11.7 389.5"
                  strokeDashoffset="-382"
                  strokeLinecap="round"
                  strokeWidth="16"
                />
              </svg>

              {/* Central Absolute Data Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] text-[#45464d] uppercase tracking-wider font-semibold">Total</span>
                <span className="text-[28px] text-[#0b1c30] font-extrabold tracking-tight leading-none">364</span>
                <span className="text-[12px] text-[#0051d5] font-semibold">Contratos</span>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-100">
              <div className="p-2 rounded-xl bg-[#eff4ff]/60 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#059669] shrink-0"></span>
                  <span className="text-[12px] text-[#0b1c30] font-medium truncate">Vigentes</span>
                </div>
                <div className="flex items-baseline gap-1 shrink-0">
                  <span className="text-[13px] font-bold text-[#0b1c30]">284</span>
                  <span className="text-[11px] text-[#45464d]">78%</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-[#eff4ff]/60 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d97706] shrink-0"></span>
                  <span className="text-[12px] text-[#0b1c30] font-medium truncate">A Vencer 30/60d</span>
                </div>
                <div className="flex items-baseline gap-1 shrink-0">
                  <span className="text-[13px] font-bold text-[#0b1c30]">51</span>
                  <span className="text-[11px] text-[#45464d]">14%</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-[#eff4ff]/60 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626] shrink-0"></span>
                  <span className="text-[12px] text-[#0b1c30] font-medium truncate">Sem Assinatura</span>
                </div>
                <div className="flex items-baseline gap-1 shrink-0">
                  <span className="text-[13px] font-bold text-[#0b1c30]">18</span>
                  <span className="text-[11px] text-[#45464d]">5%</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-[#eff4ff]/60 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#76777d] shrink-0"></span>
                  <span className="text-[12px] text-[#0b1c30] font-medium truncate">Renovação/Exp.</span>
                </div>
                <div className="flex items-baseline gap-1 shrink-0">
                  <span className="text-[13px] font-bold text-[#0b1c30]">11</span>
                  <span className="text-[11px] text-[#45464d]">3%</span>
                </div>
              </div>
            </div>

            {/* AI Extraction Micro-insight */}
            <div className="mt-4 p-3 bg-purple-50/80 border border-purple-100 rounded-xl flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#7c3aed] text-[20px] shrink-0">
                auto_awesome
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-[12px] text-[#0b1c30] font-bold truncate">
                  IA Sugere Renovação Antecipada
                </span>
                <span className="text-[11px] text-[#45464d] truncate">
                  4 contratos têm cláusula de reajuste automático em menos de 45 dias.
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateContract('CTR-2024-019')}
                className="ml-auto text-[#0051d5] hover:underline text-[12px] font-bold shrink-0"
              >
                Ver
              </button>
            </div>
          </div>

          {/* Widget 2: Upcoming Expirations Timeline (7 Columns) */}
          <div className="lg:col-span-7 p-5 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-[18px] font-bold text-[#0b1c30] tracking-tight">
                    Próximos Vencimentos Críticos
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#fffbeb] text-[#b45309] text-[11px] font-bold border border-amber-200">
                    18 Atenção
                  </span>
                </div>
                <span className="text-[11px] text-[#45464d]">
                  Ações de repactuação e distrato programadas para este trimestre
                </span>
              </div>
              <button
                onClick={() => onNavigateContract('CTR-2024-019')}
                className="text-[12px] text-[#0051d5] hover:underline font-semibold flex items-center gap-0.5"
              >
                <span>Ver todos (18)</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* Expiration Cards List */}
            <div className="flex flex-col gap-2.5 my-2">
              {/* Item 1: AWS */}
              <div className="p-3 rounded-xl bg-[#eff4ff]/40 hover:bg-[#eff4ff] border border-transparent hover:border-[#dce9ff] transition-all flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[#fffbeb] text-[#d97706] flex flex-col items-center justify-center shrink-0 border border-amber-200/60">
                    <span className="text-[16px] leading-none font-extrabold">12</span>
                    <span className="text-[9px] leading-tight uppercase font-bold">dias</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-[#0b1c30] font-bold truncate">
                        Amazon Web Services Brasil
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-[#e5eeff] text-[#0b1c30] text-[10px] font-medium">
                        Infra Cloud
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#45464d] text-[11px] mt-0.5">
                      <span>Resp: Rodrigo Castro (TI)</span>
                      <span>•</span>
                      <span className="text-[#0b1c30] font-bold">R$ 142.500/mês</span>
                      <span>•</span>
                      <span>Venc: 05/Nov/2025</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => onNavigateContract('CTR-2024-019')}
                    className="h-8 px-3 rounded-lg bg-white text-[#0b1c30] text-[12px] font-semibold border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors"
                  >
                    Detalhes
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Processo de renovação iniciado para AWS Brasil!')}
                    className="h-8 px-3 rounded-lg bg-[#0051d5] text-white text-[12px] font-semibold hover:bg-[#003ea8] active:scale-[0.98] transition-all flex items-center gap-1 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">sync</span>
                    Renovar
                  </button>
                </div>
              </div>

              {/* Item 2: TOTVS */}
              <div className="p-3 rounded-xl bg-[#eff4ff]/40 hover:bg-[#eff4ff] border border-transparent hover:border-[#dce9ff] transition-all flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[#fffbeb] text-[#d97706] flex flex-col items-center justify-center shrink-0 border border-amber-200/60">
                    <span className="text-[16px] leading-none font-extrabold">24</span>
                    <span className="text-[9px] leading-tight uppercase font-bold">dias</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-[#0b1c30] font-bold truncate">TOTVS S.A.</span>
                      <span className="px-1.5 py-0.2 rounded bg-[#e5eeff] text-[#0b1c30] text-[10px] font-medium">
                        ERP Core
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#45464d] text-[11px] mt-0.5">
                      <span>Resp: Larissa Fontes (Finanças)</span>
                      <span>•</span>
                      <span className="text-[#0b1c30] font-bold">R$ 58.900/mês</span>
                      <span>•</span>
                      <span>Venc: 17/Nov/2025</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => onNavigateContract('CTR-2024-112')}
                    className="h-8 px-3 rounded-lg bg-white text-[#0b1c30] text-[12px] font-semibold border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors"
                  >
                    Detalhes
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Processo de renovação iniciado para TOTVS S.A.!')}
                    className="h-8 px-3 rounded-lg bg-[#0051d5] text-white text-[12px] font-semibold hover:bg-[#003ea8] active:scale-[0.98] transition-all flex items-center gap-1 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">sync</span>
                    Renovar
                  </button>
                </div>
              </div>

              {/* Item 3: Dell Computadores */}
              <div className="p-3 rounded-xl bg-[#eff4ff]/40 hover:bg-[#eff4ff] border border-transparent hover:border-[#dce9ff] transition-all flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[#eff4ff] text-[#45464d] flex flex-col items-center justify-center shrink-0 border border-gray-200">
                    <span className="text-[16px] leading-none font-extrabold">42</span>
                    <span className="text-[9px] leading-tight uppercase font-bold">dias</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-[#0b1c30] font-bold truncate">
                        Dell Computadores do Brasil
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-[#e5eeff] text-[#0b1c30] text-[10px] font-medium">
                        Leasing HW
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#45464d] text-[11px] mt-0.5">
                      <span>Resp: Carlos Mendonça (Admin)</span>
                      <span>•</span>
                      <span className="text-[#0b1c30] font-bold">R$ 380.000/ano</span>
                      <span>•</span>
                      <span>Venc: 05/Dez/2025</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => onNavigateContract('CTR-2023-014')}
                    className="h-8 px-3 rounded-lg bg-white text-[#0b1c30] text-[12px] font-semibold border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors"
                  >
                    Detalhes
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Contrato Dell marcado para revisão orçamentária.')}
                    className="h-8 px-3 rounded-lg bg-white text-[#0b1c30] text-[12px] font-semibold border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    Revisar
                  </button>
                </div>
              </div>

              {/* Item 4: CleanService */}
              <div className="p-3 rounded-xl bg-[#eff4ff]/40 hover:bg-[#eff4ff] border border-transparent hover:border-[#dce9ff] transition-all flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[#eff4ff] text-[#45464d] flex flex-col items-center justify-center shrink-0 border border-gray-200">
                    <span className="text-[16px] leading-none font-extrabold">58</span>
                    <span className="text-[9px] leading-tight uppercase font-bold">dias</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-[#0b1c30] font-bold truncate">
                        CleanService Terceirização Ltda
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-[#e5eeff] text-[#0b1c30] text-[10px] font-medium">
                        Facilities
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#45464d] text-[11px] mt-0.5">
                      <span>Resp: Beatriz Silva (RH/Ops)</span>
                      <span>•</span>
                      <span className="text-[#0b1c30] font-bold">R$ 22.400/mês</span>
                      <span>•</span>
                      <span>Venc: 21/Dez/2025</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => showToast('Exibindo detalhes CleanService')}
                    className="h-8 px-3 rounded-lg bg-white text-[#0b1c30] text-[12px] font-semibold border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors"
                  >
                    Detalhes
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Contrato CleanService marcado para revisão!')}
                    className="h-8 px-3 rounded-lg bg-white text-[#0b1c30] text-[12px] font-semibold border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    Revisar
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[#45464d] text-[11px] border-t border-gray-100">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#0051d5]">verified</span>
                Notificações automáticas ativadas com 60, 30 e 15 dias de antecedência
              </span>
              <button
                onClick={onNavigateSettings}
                className="font-semibold text-[#0051d5] hover:underline"
              >
                Configurar Alertas
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Role-Based Quick Actions & Recent Ledger Table */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          {/* Role Action Panels (4 Columns) */}
          <div className="xl:col-span-4 flex flex-col gap-4">
            {/* Action Card 1: Manager Approvals */}
            <div className="p-4 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0051d5]/10 text-[#0051d5] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  </div>
                  <span className="text-[15px] font-bold text-[#0b1c30]">Aprovações Pendentes</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#316bf3] text-white text-[12px] font-bold">
                  4 novas
                </span>
              </div>
              <p className="text-[13px] text-[#45464d] mt-2">
                Há contratos com minuta final aguardando validação do departamento jurídico e diretoria executiva.
              </p>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-50">
                <span className="text-[11px] text-[#45464d]">Tempo médio: 4.2h</span>
                <button
                  type="button"
                  onClick={() => onNavigateContract('CTR-2025-019')}
                  className="text-[12px] text-[#0051d5] font-bold hover:underline flex items-center gap-1"
                >
                  Avaliar Fluxo
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Action Card 2: Operational Intake & Audit Logs */}
            <div className="p-4 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#dce9ff] text-[#0b1c30] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">history_edu</span>
                  </div>
                  <span className="text-[15px] font-bold text-[#0b1c30]">Auditoria e Cadastros</span>
                </div>
                <span className="text-[11px] text-[#45464d]">Hoje, 14:22</span>
              </div>
              <div className="flex flex-col gap-2 mt-3 text-[12px] text-[#45464d]">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#059669] mt-0.5">add_circle</span>
                  <span>
                    <strong>Mariana Rios</strong> cadastrou <em>Minuta NDA - CyberNet Brasil</em>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#0051d5] mt-0.5">lock_reset</span>
                  <span>
                    Permissão de <em>Editor Jurídico</em> atribuída a <em>Dr. Felipe Prado</em>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#ba1a1a] mt-0.5">warning</span>
                  <span>Tentativa de alteração de minuta bloqueada (Hash Inválido #84B1)</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[11px] text-[#45464d]">Trilha imutável ativa</span>
                <button
                  type="button"
                  onClick={() => showToast('Visualização do log completo de auditoria SHA-256.')}
                  className="text-[12px] text-[#0051d5] font-bold hover:underline flex items-center gap-1"
                >
                  Ver Log Completo
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Movements Table (8 Columns) */}
          <div className="xl:col-span-8 p-5 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex flex-col">
                <h2 className="text-[18px] font-bold text-[#0b1c30] tracking-tight">
                  Movimentações Recentes
                </h2>
                <span className="text-[11px] text-[#45464d]">
                  Últimas atualizações cadastrais e tramitações de contratos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => showToast('Filtro de movimentações acionado')}
                  className="px-3 py-1 rounded-lg bg-[#eff4ff] text-[#45464d] hover:text-[#0b1c30] text-[12px] font-semibold transition-colors"
                >
                  Filtrar
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Configuração de colunas')}
                  className="px-3 py-1 rounded-lg bg-[#eff4ff] text-[#45464d] hover:text-[#0b1c30] text-[12px] font-semibold transition-colors"
                >
                  Colunas
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="bg-[#eff4ff]/70 text-[#45464d] text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-3 rounded-l-lg">ID • Fornecedor</th>
                    <th className="py-2.5 px-3">Tipo / Categoria</th>
                    <th className="py-2.5 px-3">Valor Contratual</th>
                    <th className="py-2.5 px-3">Data / Vencimento</th>
                    <th className="py-2.5 px-3">Status Atual</th>
                    <th className="py-2.5 px-3 text-right rounded-r-lg">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* Row 1 */}
                  <tr
                    onClick={() => onNavigateContract('CTR-2025-0982')}
                    className="hover:bg-[#eff4ff]/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-[#0b1c30] group-hover:text-[#0051d5] transition-colors">
                          Oracle do Brasil Sistemas
                        </span>
                        <span className="text-[11px] text-[#45464d]">
                          CTR-2025-0982 • CNPJ 63.456.120/0001-90
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#e5eeff] text-[11px] text-[#0b1c30] font-medium">
                        Licenciamento SaaS
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#0b1c30]">
                      R$ 840.000,00
                    </td>
                    <td className="py-2.5 px-3 text-[#45464d] text-[11px]">
                      24/Out/2026 (12 meses)
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669] text-[12px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                        Ativo / Vigente
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateContract('CTR-2025-0982');
                        }}
                        className="p-1 rounded-lg text-[#76777d] hover:bg-[#eff4ff] hover:text-[#0b1c30]"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr
                    onClick={() => onNavigateContract('CTR-2024-0411')}
                    className="hover:bg-[#eff4ff]/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-[#0b1c30] group-hover:text-[#0051d5] transition-colors">
                          Vivo Telefônica Empresas
                        </span>
                        <span className="text-[11px] text-[#45464d]">
                          CTR-2024-0411 • CNPJ 02.558.157/0001-62
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#e5eeff] text-[11px] text-[#0b1c30] font-medium">
                        Telecomunicações
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#0b1c30]">
                      R$ 96.400,00
                    </td>
                    <td className="py-2.5 px-3 text-[#b45309] text-[11px] font-bold">
                      15/Nov/2025 (22 dias)
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fffbeb] text-[#d97706] text-[12px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]"></span>
                        A Vencer 30d
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateContract('CTR-2024-0411');
                        }}
                        className="p-1 rounded-lg text-[#76777d] hover:bg-[#eff4ff] hover:text-[#0b1c30]"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr
                    onClick={() => onNavigateContract('CTR-2025-019')}
                    className="hover:bg-[#eff4ff]/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-[#0b1c30] group-hover:text-[#0051d5] transition-colors">
                          KPMG Auditores Independentes
                        </span>
                        <span className="text-[11px] text-[#45464d]">
                          CTR-2025-1049 • CNPJ 57.755.217/0001-29
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#e5eeff] text-[11px] text-[#0b1c30] font-medium">
                        Consultoria / Auditoria
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#0b1c30]">
                      R$ 215.000,00
                    </td>
                    <td className="py-2.5 px-3 text-[#45464d] text-[11px]">
                      Aguardando Validação
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[12px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
                        Sem Assinatura
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateContract('CTR-2025-019');
                        }}
                        className="p-1 rounded-lg text-[#76777d] hover:bg-[#eff4ff] hover:text-[#0b1c30]"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr
                    onClick={() => onNavigateContract('CTR-2024-0188')}
                    className="hover:bg-[#eff4ff]/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-[#0b1c30] group-hover:text-[#0051d5] transition-colors">
                          Gupy Tecnologia em Recrutamento
                        </span>
                        <span className="text-[11px] text-[#45464d]">
                          CTR-2024-0188 • CNPJ 23.514.660/0001-44
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#e5eeff] text-[11px] text-[#0b1c30] font-medium">
                        Plataforma RH
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#0b1c30]">
                      R$ 78.200,00
                    </td>
                    <td className="py-2.5 px-3 text-[#45464d] text-[11px]">
                      12/Jan/2026 (80 dias)
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669] text-[12px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                        Ativo / Vigente
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateContract('CTR-2024-0188');
                        }}
                        className="p-1 rounded-lg text-[#76777d] hover:bg-[#eff4ff] hover:text-[#0b1c30]"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Table Footer Pagination/Status */}
            <div className="flex items-center justify-between pt-3 mt-1 text-[11px] text-[#45464d] border-t border-gray-100">
              <span>Mostrando 4 de 364 registros</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled
                  className="px-2.5 py-1 rounded-lg bg-[#eff4ff] text-[#45464d] disabled:opacity-50 font-medium"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-lg bg-[#0051d5] text-white font-bold"
                >
                  1
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Página 2 de registros')}
                  className="px-2.5 py-1 rounded-lg bg-[#eff4ff] text-[#0b1c30] hover:bg-[#dce9ff] font-medium transition-colors"
                >
                  2
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Página 3 de registros')}
                  className="px-2.5 py-1 rounded-lg bg-[#eff4ff] text-[#0b1c30] hover:bg-[#dce9ff] font-medium transition-colors"
                >
                  3
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Próxima página')}
                  className="px-2.5 py-1 rounded-lg bg-[#eff4ff] text-[#0b1c30] hover:bg-[#dce9ff] font-medium transition-colors"
                >
                  Próxima
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#131b2e] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-white/10 animate-in fade-in slide-in-from-bottom-3">
          <span className="material-symbols-outlined text-[#316bf3] text-[20px]">info</span>
          <span className="text-[13px] font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
