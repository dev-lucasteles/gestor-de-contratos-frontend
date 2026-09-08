import React, { useState } from 'react';
import { SystemSettings, NotificationItem } from '../types';

interface SettingsViewProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: SystemSettings) => void;
  notifications: NotificationItem[];
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  notifications,
}) => {
  const [activeTab, setActiveTab] = useState('notificacoes');
  const [formData, setFormData] = useState<SystemSettings>(settings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggle = (key: keyof Pick<SystemSettings, 'notice30Days' | 'notice60Days' | 'signaturePending7Days' | 'aiRiskInstantAlert'>) => {
    setFormData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    showToast('Configurações e parâmetros de alertas salvos com sucesso!');
  };

  return (
    <div className="flex flex-col w-full">
      <div className="p-6 flex flex-col gap-6 w-full max-w-[1600px] mx-auto animate-in fade-in duration-300">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-[26px] font-bold text-[#0b1c30] tracking-tight leading-none">
                Configurações do Sistema
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] text-[#0051d5] text-[11px] font-bold border border-[#dce9ff]">
                Governança & Alertas
              </span>
            </div>
            <p className="text-[13px] text-[#45464d] mt-1">
              Governança corporativa, automações de vencimento, matriz de perfis RBAC e trilha de auditoria
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setFormData(settings);
                showToast('Alterações descartadas.');
              }}
              className="h-9 px-3.5 rounded-xl bg-white border border-[#e5eeff] text-[#45464d] hover:text-[#0b1c30] hover:bg-[#eff4ff] text-[13px] font-semibold transition-colors"
            >
              Descartar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="h-9 px-4 rounded-xl bg-[#0051d5] hover:bg-[#003ea8] text-white text-[13px] font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>Salvar Preferências</span>
            </button>
          </div>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-0.5">
          <button
            type="button"
            onClick={() => setActiveTab('geral')}
            className={`px-4 py-2.5 text-[13px] font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'geral'
                ? 'border-[#0051d5] text-[#0051d5]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Geral</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notificacoes')}
            className={`px-4 py-2.5 text-[13px] font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'notificacoes'
                ? 'border-[#0051d5] text-[#0051d5]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">notifications_active</span>
            <span>Notificações & Alertas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('perfis')}
            className={`px-4 py-2.5 text-[13px] font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'perfis'
                ? 'border-[#0051d5] text-[#0051d5]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
            <span>Perfis & Permissões (RBAC)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('integracoes')}
            className={`px-4 py-2.5 text-[13px] font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'integracoes'
                ? 'border-[#0051d5] text-[#0051d5]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">integration_instructions</span>
            <span>Integrações & API</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seguranca')}
            className={`px-4 py-2.5 text-[13px] font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'seguranca'
                ? 'border-[#0051d5] text-[#0051d5]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Segurança & Auditoria</span>
          </button>
        </div>

        {/* 2-Column Layout matching Image 5.png */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Proactive Engine, Email Toggles, RBAC Matrix (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Section: Motor de Alertas Proativos */}
            <div className="p-5 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0051d5]/10 text-[#0051d5] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-[16px] font-bold text-[#0b1c30]">
                      Motor de Alertas Proativos & Inteligência Preditiva
                    </h2>
                    <span className="text-[12px] text-[#45464d]">
                      Disparos automáticos para mitigar reajustes compulsórios e multas por rescisão imotivada.
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#059669] text-[10px] font-bold border border-emerald-200">
                    SLA 99.98%
                  </span>
                  <span className="text-[10px] text-gray-400">Fila Ativa: 18 disparos hoje</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
                {/* Toggle 1: 30 dias */}
                <div className="flex items-start justify-between p-3 rounded-xl bg-[#eff4ff]/40 border border-[#dce9ff]/60 hover:bg-[#eff4ff] transition-colors">
                  <div className="flex flex-col pr-4">
                    <span className="text-[13px] font-bold text-[#0b1c30]">
                      Aviso Prévio com 30 Dias de Antecedência
                    </span>
                    <span className="text-[11px] text-[#45464d] mt-0.5">
                      Notificar gestor do contrato e departamento de compras sobre janelas de renovação contratual.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('notice30Days')}
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 mt-0.5 ${
                      formData.notice30Days ? 'bg-[#0051d5]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white shadow transform transition-transform absolute top-1 ${
                        formData.notice30Days ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    ></span>
                  </button>
                </div>

                {/* Toggle 2: 60 dias */}
                <div className="flex items-start justify-between p-3 rounded-xl bg-[#eff4ff]/40 border border-[#dce9ff]/60 hover:bg-[#eff4ff] transition-colors">
                  <div className="flex flex-col pr-4">
                    <span className="text-[13px] font-bold text-[#0b1c30]">
                      Alerta Crítico com 60 Dias (Reajuste de Índices)
                    </span>
                    <span className="text-[11px] text-[#45464d] mt-0.5">
                      Obrigatório para contratos com cláusula de reajuste automático por índice (IPCA/IGP-M/Dólar).
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('notice60Days')}
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 mt-0.5 ${
                      formData.notice60Days ? 'bg-[#0051d5]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white shadow transform transition-transform absolute top-1 ${
                        formData.notice60Days ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    ></span>
                  </button>
                </div>

                {/* Toggle 3: Pendência Assinatura */}
                <div className="flex items-start justify-between p-3 rounded-xl bg-[#eff4ff]/40 border border-[#dce9ff]/60 hover:bg-[#eff4ff] transition-colors">
                  <div className="flex flex-col pr-4">
                    <span className="text-[13px] font-bold text-[#0b1c30]">
                      Pendência de Assinatura (&gt; 7 dias)
                    </span>
                    <span className="text-[11px] text-[#45464d] mt-0.5">
                      Reenviar lembrete automático aos signatários com minuta parada na mesa de aprovação.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('signaturePending7Days')}
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 mt-0.5 ${
                      formData.signaturePending7Days ? 'bg-[#0051d5]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white shadow transform transition-transform absolute top-1 ${
                        formData.signaturePending7Days ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    ></span>
                  </button>
                </div>

                {/* Toggle 4: Alerta Risco IA */}
                <div className="flex items-start justify-between p-3 rounded-xl bg-purple-50/60 border border-purple-200 hover:bg-purple-50 transition-colors">
                  <div className="flex flex-col pr-4">
                    <span className="text-[13px] font-bold text-purple-950 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-purple-600">auto_awesome</span>
                      Alerta Instantâneo de Risco por IA
                    </span>
                    <span className="text-[11px] text-purple-800/80 mt-0.5">
                      Disparar e-mail imediato se o motor de IA identificar cláusula leonina ou multa de rescisão abusiva.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('aiRiskInstantAlert')}
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 mt-0.5 ${
                      formData.aiRiskInstantAlert ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white shadow transform transition-transform absolute top-1 ${
                        formData.aiRiskInstantAlert ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    ></span>
                  </button>
                </div>
              </div>

              {/* Destinatários Padrão */}
              <div className="pt-3 border-t border-gray-100 flex flex-col gap-3">
                <span className="text-[13px] font-bold text-[#0b1c30]">
                  Destinatários Padrão para Notificações Corporativas
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-gray-600">
                      Departamento Jurídico
                    </label>
                    <input
                      type="email"
                      value={formData.legalEmail}
                      onChange={(e) => setFormData({ ...formData, legalEmail: e.target.value })}
                      className="h-9 px-3 rounded-xl bg-gray-50 border border-gray-200 text-[12px] text-[#0b1c30] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-gray-600">
                      Controladoria / Finanças
                    </label>
                    <input
                      type="email"
                      value={formData.financeEmail}
                      onChange={(e) => setFormData({ ...formData, financeEmail: e.target.value })}
                      className="h-9 px-3 rounded-xl bg-gray-50 border border-gray-200 text-[12px] text-[#0b1c30] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Gestão de Perfis & Matriz de Permissões (RBAC) */}
            <div className="p-5 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0051d5] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">shield_lock</span>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-[16px] font-bold text-[#0b1c30]">
                      Gestão de Perfis de Usuário & Matriz de Permissões (RBAC)
                    </h2>
                    <span className="text-[12px] text-[#45464d]">
                      Controle granular de acesso por responsabilidade funcional
                    </span>
                  </div>
                </div>
              </div>

              {/* RBAC Table */}
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-[12px]">
                  <thead>
                    <tr className="bg-[#eff4ff]/80 text-[#45464d] text-[11px] uppercase tracking-wider font-semibold border-b border-[#e5eeff]">
                      <th className="py-2.5 px-3">Módulo do Sistema</th>
                      <th className="py-2.5 px-3 text-center">Administrador</th>
                      <th className="py-2.5 px-3 text-center">Gestor</th>
                      <th className="py-2.5 px-3 text-center">Operacional</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {formData.rbacMatrix.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#eff4ff]/30 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-[#0b1c30]">{item.module}</span>
                            <span className="text-[10px] text-gray-500">{item.subtext}</span>
                          </div>
                        </td>

                        {/* Admin */}
                        <td className="py-2.5 px-3 text-center">
                          <span className="material-symbols-outlined text-[20px] text-emerald-600">
                            check_circle
                          </span>
                        </td>

                        {/* Gestor */}
                        <td className="py-2.5 px-3 text-center">
                          {item.gestor ? (
                            <span className="material-symbols-outlined text-[20px] text-emerald-600">
                              check_circle
                            </span>
                          ) : (
                            <span className="material-symbols-outlined text-[20px] text-gray-300">
                              block
                            </span>
                          )}
                        </td>

                        {/* Operacional */}
                        <td className="py-2.5 px-3 text-center">
                          {item.operacional === true && (
                            <span className="material-symbols-outlined text-[20px] text-emerald-600">
                              check_circle
                            </span>
                          )}
                          {item.operacional === false && (
                            <span className="material-symbols-outlined text-[20px] text-gray-300">
                              block
                            </span>
                          )}
                          {item.operacional === 'leitura' && (
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                              Somente Leitura
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Live Notification Dropdown Simulation & Channel Health (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Live Preview of Notification Center */}
            <div className="p-5 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0051d5] text-[20px]">preview</span>
                  <span className="text-[14px] font-bold text-[#0b1c30]">
                    Simulação da Central de Notificações
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0051d5] text-[10px] font-bold">
                  Preview Ativo
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Visualização em tempo real do dropdown de alertas para os usuários corporativos:
              </p>

              {/* Dropdown Simulation Box */}
              <div className="p-3 bg-gray-50/80 rounded-2xl border border-gray-200 flex flex-col gap-2">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-[12px] font-bold text-[#0b1c30]">Notificações (3)</span>
                  <span className="text-[10px] text-[#0051d5] font-semibold">Marcar todas como lidas</span>
                </div>

                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-xl bg-white border border-[#e5eeff] shadow-sm flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-bold text-[#0b1c30]">{n.title}</span>
                      <span className="text-[10px] text-gray-400">{n.timeAgo}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-tight">{n.description}</p>
                    {n.badgeText && (
                      <div className="mt-1 flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            n.urgent ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-[#0051d5]'
                          }`}
                        >
                          {n.badgeText}
                        </span>
                        <span className="text-[11px] text-[#0051d5] font-bold hover:underline cursor-pointer">
                          Ver contrato →
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Channel Health Status */}
            <div className="p-5 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-3">
              <span className="text-[14px] font-bold text-[#0b1c30] flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[20px]">lan</span>
                Integridade dos Canais de Notificação
              </span>

              <div className="flex flex-col gap-2.5">
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-600 text-[18px]">mail</span>
                    <span className="text-[12px] font-semibold text-gray-800">Servidor SMTP Transacional</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Conectado (142ms)
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-600 text-[18px]">chat</span>
                    <span className="text-[12px] font-semibold text-gray-800">Webhook Slack Jurídico</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Ativo (#alertas-clm)
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-600 text-[18px]">sms</span>
                    <span className="text-[12px] font-semibold text-gray-800">SMS / WhatsApp Corporativo</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium">
                    Opcional
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast('Disparo de e-mail de teste enviado para o endereço corporativo!')}
                className="mt-2 w-full h-9 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0051d5] text-[12px] font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Testar Disparo de Alerta</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#131b2e] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-white/10 animate-in fade-in slide-in-from-bottom-3">
          <span className="material-symbols-outlined text-[#316bf3] text-[20px]">info</span>
          <span className="text-[13px] font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
