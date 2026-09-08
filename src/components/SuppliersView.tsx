import React, { useState } from 'react';
import { Supplier } from '../types';

interface SuppliersViewProps {
  suppliers: Supplier[];
  onAddSupplier: (newSupplier: Supplier) => void;
  onSelectSupplierContracts?: (supplierId: string) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  onAddSupplier,
  onSelectSupplierContracts,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Supplier Form State
  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [inscricaoEstadual, setInscricaoEstadual] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Serviços de TI', 'Software SaaS']);
  const [riskLevel, setRiskLevel] = useState<'baixo' | 'medio' | 'alto'>('baixo');
  const [isConsultingReceita, setIsConsultingReceita] = useState(false);

  const availableTags = [
    'Serviços de TI',
    'Software SaaS',
    'Infraestrutura',
    'Segurança da Informação',
    'Logística',
    'Manutenção Predial',
    'Serviços Contábeis',
    'Consultoria Jurídica',
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleConsultarReceita = () => {
    setIsConsultingReceita(true);
    showToast('Consultando bases da Receita Federal e Sintegra...');
    setTimeout(() => {
      setIsConsultingReceita(false);
      setRazaoSocial('Omni Cloud Soluções em Tecnologia Ltda.');
      setNomeFantasia('Omni Cloud Brasil • DataCenters');
      setInscricaoEstadual('119.882.341.002');
      setContactName('Marcos Vinícius de Oliveira');
      setContactRole('Diretor de Alianças Corporativas');
      setContactEmail('m.vinicius@omnicloud.com.br');
      setContactPhone('+55 (11) 3221-9988');
      showToast('Dados cadastrais sincronizados com a Receita Federal!');
    }, 1200);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!razaoSocial.trim()) {
      showToast('Preencha a Razão Social do fornecedor.');
      return;
    }

    const newSupplier: Supplier = {
      id: 'sup-' + Date.now(),
      cnpj: cnpj || '45.109.882/0001-33',
      razaoSocial: razaoSocial.trim(),
      nomeFantasia: nomeFantasia || razaoSocial.trim(),
      inscricaoEstadual: inscricaoEstadual || 'Isento',
      contactName: contactName || 'Representante Legal',
      contactRole: contactRole || 'Gerente de Contas',
      contactEmail: contactEmail || 'contato@fornecedor.com.br',
      contactPhone: contactPhone || '+55 (11) 3000-0000',
      activities: selectedTags.length > 0 ? selectedTags : ['Serviços Especializados'],
      riskLevel: riskLevel,
      activeContractsCount: 0,
      totalFinancialVolume: 0,
      status: 'ativo',
      syncDate: 'Hoje às 15:30',
    };

    onAddSupplier(newSupplier);
    setIsDrawerOpen(false);
    showToast(`Fornecedor ${newSupplier.razaoSocial} cadastrado e homologado com sucesso!`);

    // Reset Form
    setCnpj('');
    setRazaoSocial('');
    setNomeFantasia('');
    setInscricaoEstadual('');
    setContactName('');
    setContactRole('');
    setContactEmail('');
    setContactPhone('');
  };

  const filteredSuppliers = suppliers.filter((s) => {
    if (statusFilter !== 'todos' && s.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        s.razaoSocial.toLowerCase().includes(q) ||
        s.nomeFantasia.toLowerCase().includes(q) ||
        s.cnpj.includes(q) ||
        s.contactName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalHomologados = suppliers.filter((s) => s.status === 'ativo').length;
  const totalEmHomologacao = suppliers.filter((s) => s.status === 'homologacao').length;

  return (
    <div className="flex flex-col w-full relative">
      <div className="p-6 flex flex-col gap-6 w-full max-w-[1600px] mx-auto animate-in fade-in duration-300">
        {/* Header & Global Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-[26px] font-bold text-[#0b1c30] tracking-tight leading-none">
                Gestão de Fornecedores
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] text-[#0051d5] text-[11px] font-bold border border-[#dce9ff]">
                Governança & Risco
              </span>
            </div>
            <p className="text-[13px] text-[#45464d] mt-1">
              Homologação de parceiros, compliance fiscal e exposição a risco de terceiros
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => showToast('Exportando cadastro geral de fornecedores em CSV...')}
              className="h-9 px-3.5 rounded-xl bg-white border border-[#e5eeff] text-[#0b1c30] hover:bg-[#eff4ff] text-[13px] font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Exportar CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="h-9 px-4 rounded-xl bg-[#0051d5] hover:bg-[#003ea8] active:scale-[0.98] text-white text-[13px] font-bold transition-all flex items-center gap-1.5 shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">domain_add</span>
              <span>Novo Fornecedor</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#45464d] font-semibold">
                Total Registrado
              </span>
              <span className="text-[28px] font-bold text-[#0b1c30] tracking-tight leading-none mt-1">
                {suppliers.length}
              </span>
              <span className="text-[11px] text-[#45464d] mt-1">Base ativa corporativa</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0051d5] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">apartment</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#059669] font-semibold">
                Homologados & Ativos
              </span>
              <span className="text-[28px] font-bold text-[#059669] tracking-tight leading-none mt-1">
                {totalHomologados}
              </span>
              <span className="text-[11px] text-[#45464d] mt-1">Certidões e CND válidas</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">verified_user</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#d97706] font-semibold">
                Em Homologação
              </span>
              <span className="text-[28px] font-bold text-[#d97706] tracking-tight leading-none mt-1">
                {totalEmHomologacao}
              </span>
              <span className="text-[11px] text-[#45464d] mt-1">Processos abertos no jurídico</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#d97706] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">pending_actions</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#45464d] font-semibold">
                Volume Financeiro YTD
              </span>
              <span className="text-[28px] font-bold text-[#0b1c30] tracking-tight leading-none mt-1">
                R$ 48,2M
              </span>
              <span className="text-[11px] text-[#059669] font-medium mt-1">Alocado em vigência</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0051d5] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">payments</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[280px]">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar por Razão Social, Nome Fantasia ou CNPJ..."
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#eff4ff]/60 border border-[#dce9ff] text-[13px] text-[#0b1c30] placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0051d5]/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-xl bg-white border border-[#dce9ff] text-[13px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20 cursor-pointer"
            >
              <option value="todos">Todos os Status</option>
              <option value="ativo">Homologados / Ativos</option>
              <option value="homologacao">Em Homologação</option>
              <option value="bloqueado">Bloqueados</option>
            </select>

            <select
              className="h-10 px-3 rounded-xl bg-white border border-[#dce9ff] text-[13px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20 cursor-pointer"
            >
              <option>Todas as Categorias</option>
              <option>Tecnologia e Nuvem</option>
              <option>Consultoria e Auditoria</option>
              <option>Facilities e Infraestrutura</option>
            </select>
          </div>
        </div>

        {/* Suppliers Data Table */}
        <div className="bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-[#eff4ff]/80 text-[#45464d] text-[11px] uppercase tracking-wider font-semibold border-b border-[#e5eeff]">
                  <th className="py-3 px-4">Fornecedor / CNPJ</th>
                  <th className="py-3 px-4">Representante Legal</th>
                  <th className="py-3 px-4">Atividades & Tags</th>
                  <th className="py-3 px-4">Risco & Compliance</th>
                  <th className="py-3 px-4">Contratos / Volume</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="hover:bg-[#eff4ff]/40 transition-colors group"
                  >
                    {/* Fornecedor */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#eff4ff] text-[#0051d5] flex items-center justify-center font-bold text-xs shrink-0 border border-[#dce9ff]">
                          {supplier.razaoSocial.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[13px] font-bold text-[#0b1c30] group-hover:text-[#0051d5] transition-colors">
                            {supplier.razaoSocial}
                          </span>
                          <span className="text-[11px] text-[#45464d]">{supplier.nomeFantasia}</span>
                          <span className="text-[10px] font-mono text-gray-400 mt-0.5">
                            CNPJ: {supplier.cnpj}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contato Principal */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-[12px] font-semibold text-[#0b1c30]">
                          {supplier.contactName}
                        </span>
                        <span className="text-[10px] text-gray-500">{supplier.contactRole}</span>
                        <span className="text-[10px] text-[#0051d5] mt-0.5">{supplier.contactEmail}</span>
                      </div>
                    </td>

                    {/* Atividades Tags */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {supplier.activities.map((act, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-[#e5eeff] text-[#0b1c30] text-[10px] font-medium"
                          >
                            {act}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Risco */}
                    <td className="py-3 px-4">
                      {supplier.riskLevel === 'baixo' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[#059669] text-[11px] font-bold border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                          Baixo Risco
                        </span>
                      )}
                      {supplier.riskLevel === 'medio' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-[#d97706] text-[11px] font-bold border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]"></span>
                          Médio Risco
                        </span>
                      )}
                      {supplier.riskLevel === 'alto' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-[#ba1a1a] text-[11px] font-bold border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
                          Alto Risco
                        </span>
                      )}
                    </td>

                    {/* Contratos / Volume */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-[#0b1c30]">
                          {supplier.activeContractsCount} contratos
                        </span>
                        <span className="text-[11px] text-gray-500">
                          R$ {supplier.totalFinancialVolume.toLocaleString('pt-BR')},00
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {supplier.status === 'ativo' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[#059669] text-[11px] font-semibold">
                          Homologado
                        </span>
                      )}
                      {supplier.status === 'homologacao' && (
                        <div className="flex flex-col">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-[#d97706] text-[11px] font-semibold">
                            Em Homologação
                          </span>
                          {supplier.statusReason && (
                            <span className="text-[9px] text-gray-400 mt-0.5 max-w-[130px] truncate">
                              {supplier.statusReason}
                            </span>
                          )}
                        </div>
                      )}
                      {supplier.status === 'bloqueado' && (
                        <div className="flex flex-col">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-[#ba1a1a] text-[11px] font-bold">
                            Bloqueado
                          </span>
                          {supplier.statusReason && (
                            <span className="text-[9px] text-red-500 mt-0.5 max-w-[130px] truncate">
                              {supplier.statusReason}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Ações */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectSupplierContracts) {
                              onSelectSupplierContracts(supplier.id);
                            } else {
                              showToast(`Filtrando contratos de ${supplier.razaoSocial}`);
                            }
                          }}
                          className="h-8 px-2.5 rounded-lg bg-white border border-gray-200 hover:bg-[#eff4ff] text-[#0051d5] text-[12px] font-semibold transition-colors"
                        >
                          Ver Contratos
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide-over Drawer "Cadastrar Novo Fornecedor" (Image 11.png) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-gray-200 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#eff4ff]/40 sticky top-0 z-20">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#0051d5] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">domain_add</span>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-[17px] font-bold text-[#0b1c30]">
                    Cadastrar Novo Fornecedor
                  </h2>
                  <span className="text-[11px] text-gray-500">
                    Homologação integrada com a Receita Federal
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Body Form */}
            <form onSubmit={handleSaveSupplier} className="p-6 flex flex-col gap-4 flex-1">
              {/* CNPJ with Auto-lookup */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-[#0b1c30]">
                  CNPJ *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    required
                    className="flex-1 h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-[13px] font-mono text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20"
                  />
                  <button
                    type="button"
                    disabled={isConsultingReceita}
                    onClick={handleConsultarReceita}
                    className="h-10 px-3.5 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0051d5] text-[12px] font-bold transition-all flex items-center gap-1 shrink-0 border border-[#dce9ff]"
                  >
                    <span className={`material-symbols-outlined text-[16px] ${isConsultingReceita ? 'animate-spin' : ''}`}>
                      {isConsultingReceita ? 'sync' : 'search'}
                    </span>
                    <span>{isConsultingReceita ? 'Buscando...' : 'Consultar Receita'}</span>
                  </button>
                </div>
              </div>

              {/* Razão Social */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-[#0b1c30]">
                  Razão Social *
                </label>
                <input
                  type="text"
                  value={razaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                  placeholder="Ex: Amazon Web Services Brasil Ltda."
                  required
                  className="h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-[13px] text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20"
                />
              </div>

              {/* Nome Fantasia & IE */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-[#0b1c30]">
                    Nome Fantasia
                  </label>
                  <input
                    type="text"
                    value={nomeFantasia}
                    onChange={(e) => setNomeFantasia(e.target.value)}
                    placeholder="AWS Brasil"
                    className="h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-[13px] text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-[#0b1c30]">
                    Inscrição Estadual
                  </label>
                  <input
                    type="text"
                    value={inscricaoEstadual}
                    onChange={(e) => setInscricaoEstadual(e.target.value)}
                    placeholder="114.839.201.110 ou Isento"
                    className="h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-[13px] text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20"
                  />
                </div>
              </div>

              {/* Contato Principal */}
              <div className="p-3.5 rounded-2xl bg-[#eff4ff]/50 border border-[#dce9ff] flex flex-col gap-3">
                <span className="text-[12px] font-bold text-[#0b1c30] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#0051d5]">badge</span>
                  Contato Principal & Representante Legal
                </span>

                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Nome completo do titular"
                    className="h-9 px-3 rounded-lg bg-white border border-gray-200 text-[12px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20"
                  />
                  <input
                    type="text"
                    value={contactRole}
                    onChange={(e) => setContactRole(e.target.value)}
                    placeholder="Cargo (ex: Diretor de Contas)"
                    className="h-9 px-3 rounded-lg bg-white border border-gray-200 text-[12px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20"
                  />
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="E-mail corporativo"
                    className="h-9 px-3 rounded-lg bg-white border border-gray-200 text-[12px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20"
                  />
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+55 (11) 90000-0000"
                    className="h-9 px-3 rounded-lg bg-white border border-gray-200 text-[12px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20"
                  />
                </div>
              </div>

              {/* Tags de Atividades */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-[#0b1c30]">
                  Tags de Atividades
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                          isSelected
                            ? 'bg-[#0051d5] text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Nível de Risco & Compliance */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-[#0b1c30]">
                  Nível de Risco & Compliance
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRiskLevel('baixo')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      riskLevel === 'baixo'
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] text-emerald-600">verified</span>
                    <span className="text-[11px] font-bold">Baixo Risco</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRiskLevel('medio')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      riskLevel === 'medio'
                        ? 'border-amber-500 bg-amber-50/80 text-amber-900 ring-2 ring-amber-500/20'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] text-amber-600">warning</span>
                    <span className="text-[11px] font-bold">Médio Risco</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRiskLevel('alto')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      riskLevel === 'alto'
                        ? 'border-red-500 bg-red-50/80 text-red-900 ring-2 ring-red-500/20'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] text-red-600">security_update_warning</span>
                    <span className="text-[11px] font-bold">Alto Risco</span>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2 sticky bottom-0 bg-white z-10">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="h-10 px-4 rounded-xl text-gray-600 hover:bg-gray-100 text-[13px] font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-[#0051d5] hover:bg-[#003ea8] text-white text-[13px] font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Salvar Fornecedor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
