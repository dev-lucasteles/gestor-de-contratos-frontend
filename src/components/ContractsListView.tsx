import React, { useState } from 'react';
import { Contract, Supplier, ContractStatus, UserRole } from '../types';
import { ConfirmationModal } from './ConfirmationModal';

interface ContractsListViewProps {
  contracts: Contract[];
  suppliers: Supplier[];
  onSelectContract: (contract: Contract) => void;
  onAddNewContract: (newContract: Partial<Contract>) => void;
  onDeleteContract?: (contractId: string) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  currentRole?: UserRole;
}

export const ContractsListView: React.FC<ContractsListViewProps> = ({
  contracts,
  suppliers,
  onSelectContract,
  onAddNewContract,
  onDeleteContract,
  isDrawerOpen,
  setIsDrawerOpen,
  currentRole = 'administrador',
}) => {
  const [activeFilterTab, setActiveFilterTab] = useState<'todos' | ContractStatus>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplierFilter, setSelectedSupplierFilter] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Confirmation Modal State for Contract Deletion
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null);
  const [isDeletingContract, setIsDeletingContract] = useState(false);

  // New Contract Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSupplierId, setNewSupplierId] = useState(suppliers[0]?.id || '');
  const [newInternalId, setNewInternalId] = useState('#' + Math.floor(1000 + Math.random() * 9000) + '-25');
  const [newStartDate, setNewStartDate] = useState('2025-05-01');
  const [newEndDate, setNewEndDate] = useState('2026-05-01');
  const [newTotalValue, setNewTotalValue] = useState('180000');
  const [newPeriodicity, setNewPeriodicity] = useState<'mensal' | 'anual' | 'demanda' | 'plurianual'>('mensal');
  const [newIsSigned, setNewIsSigned] = useState(true);
  const [newNotificationEmail, setNewNotificationEmail] = useState('gestor.contratos@empresa.com.br');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isAiFilling, setIsAiFilling] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter logic
  const filteredContracts = contracts.filter((c) => {
    if (activeFilterTab !== 'todos' && c.status !== activeFilterTab) return false;
    if (selectedSupplierFilter && c.supplierId !== selectedSupplierFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        c.code.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.supplierName.toLowerCase().includes(q) ||
        c.supplierCnpj.includes(q)
      );
    }
    return true;
  });

  const countByStatus = {
    todos: contracts.length,
    vigente: contracts.filter((c) => c.status === 'vigente').length,
    avencer: contracts.filter((c) => c.status === 'avencer').length,
    sem_assinatura: contracts.filter((c) => c.status === 'sem_assinatura').length,
    expirado: contracts.filter((c) => c.status === 'expirado').length,
  };

  const handleSimulateAiFill = () => {
    setIsAiFilling(true);
    showToast('IA lendo minuta jurídica e extraindo metadados automaticamente...');
    setTimeout(() => {
      setIsAiFilling(false);
      setNewTitle('Fornecimento e Licenciamento de Software Cloud');
      setNewSupplierId('aws');
      setNewTotalValue('360000');
      setNewNotificationEmail('gestor.cloud@empresa.com.br');
      setUploadedFileName('Minuta_AWS_Cloud_Assinada_v2.pdf');
      setNewIsSigned(true);
      showToast('Campos preenchidos com precisão pela IA!');
    }, 1200);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find((s) => s.id === newSupplierId) || suppliers[0];
    const val = parseFloat(newTotalValue) || 100000;
    const generatedCode = `CTR-2025-${Math.floor(100 + Math.random() * 900)}`;

    const newContract: Partial<Contract> = {
      id: 'ctr-' + Date.now(),
      code: generatedCode,
      internalId: newInternalId,
      title: newTitle || 'Contrato de Prestação de Serviços Tecnológicos',
      supplierId: sup.id,
      supplierName: sup.razaoSocial,
      supplierCnpj: sup.cnpj,
      category: 'Tecnologia / SaaS',
      startDate: newStartDate,
      endDate: newEndDate,
      totalDays: 365,
      remainingDays: 365,
      totalValue: val,
      monthlyValue: newPeriodicity === 'mensal' ? Math.round(val / 12) : undefined,
      periodicity: newPeriodicity,
      status: newIsSigned ? 'vigente' : 'sem_assinatura',
      signatureStatus: newIsSigned ? 'Assinado Digitalmente' : 'Pendente de Assinatura',
      hasOcr: true,
      progressPercent: 2,
      isSigned: newIsSigned,
      notificationEmail: newNotificationEmail.trim() || 'gestor.contratos@empresa.com.br',
      notifyOnExpiration: true,
      notifyOnStatusChange: true,
      signers: [
        {
          id: 's-auto',
          name: 'Lucas Teles',
          role: 'Diretor Jurídico & CLO',
          cpf: '***.382.918-**',
          signed: newIsSigned,
          signedAt: newIsSigned ? 'Hoje às 15:00' : undefined,
          avatarInitials: 'LT',
        },
      ],
      attachments: uploadedFileName
        ? [
            {
              id: 'att-1',
              name: uploadedFileName,
              size: '1.8 MB',
              addedAt: 'Hoje',
              type: 'pdf',
              description: 'Processado com OCR e hash ICP-Brasil',
            },
          ]
        : [],
      aiInsights: {
        executiveSummary: `Instrumento cadastrado com sucesso. Objeto: ${newTitle}. Vigência estipulada até ${newEndDate}.`,
        items: [
          {
            topic: 'Vigência e Término',
            summary: `Contrato ativo com monitoramento preventivo de vencimento em ${newEndDate}.`,
            icon: 'schedule',
          },
          {
            topic: 'Classificação Financeira',
            summary: `Valor total registrado de R$ ${val.toLocaleString('pt-BR')},00 (${newPeriodicity}).`,
            icon: 'payments',
          },
        ],
      },
    };

    onAddNewContract(newContract);
    setIsDrawerOpen(false);
    showToast(`Contrato ${generatedCode} cadastrado com sucesso!`);
  };

  return (
    <div className="flex flex-col w-full relative">
      <div className="p-6 flex flex-col gap-6 w-full max-w-[1600px] mx-auto animate-in fade-in duration-300">
        {/* Executive Banner */}
        <div className="p-6 bg-gradient-to-r from-[#131b2e] via-[#1a2542] to-[#131b2e] text-white rounded-3xl shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 border border-white/10 relative overflow-hidden">
          <div className="flex flex-col z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#316bf3] text-white text-[11px] font-bold uppercase tracking-wider">
                Painel Executivo
              </span>
              <span className="text-[12px] text-gray-300 font-medium">Gestão Unificada de Contratos</span>
            </div>
            <h1 className="text-[26px] font-bold tracking-tight text-white mt-1">
              Repositório Central & Ciclo de Vida (CLM)
            </h1>
            <p className="text-[13px] text-gray-300 mt-0.5">
              Exposição Financeira Total:{' '}
              <strong className="text-white font-bold">R$ 18.420.900,00</strong> • Taxa de conformidade:{' '}
              <strong className="text-emerald-400 font-bold">98.2%</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 z-10">
            <button
              type="button"
              onClick={() => showToast('Exportando relatório consolidado em formato CSV/Excel...')}
              className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-[13px] font-semibold transition-all flex items-center gap-2 border border-white/10"
            >
              <span className="material-symbols-outlined text-[18px]">table_view</span>
              <span>Exportar CSV</span>
            </button>

            {currentRole !== 'visualizador' && (
              <button
                type="button"
                id="btn-new-contract-list"
                onClick={() => setIsDrawerOpen(true)}
                className="h-10 px-4 rounded-xl bg-[#0051d5] hover:bg-[#003ea8] active:scale-[0.98] text-white text-[13px] font-semibold transition-all flex items-center gap-2 shadow-lg shadow-[#0051d5]/30"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Novo Instrumento</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#45464d] font-semibold">
                Volume Total
              </span>
              <span className="text-[28px] font-bold text-[#0b1c30] tracking-tight leading-none mt-1">
                {countByStatus.todos}
              </span>
              <span className="text-[11px] text-[#45464d] mt-1">Instrumentos cadastrados</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0051d5] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">folder_copy</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#059669] font-semibold">
                Vigentes e Ativos
              </span>
              <span className="text-[28px] font-bold text-[#059669] tracking-tight leading-none mt-1">
                {countByStatus.vigente}
              </span>
              <span className="text-[11px] text-[#45464d] mt-1">+4 novos este mês</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">check_circle</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#d97706] font-semibold">
                Atenção (30-60d)
              </span>
              <span className="text-[28px] font-bold text-[#d97706] tracking-tight leading-none mt-1">
                {countByStatus.avencer}
              </span>
              <span className="text-[11px] text-[#45464d] mt-1">Em risco de renovação</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#d97706] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">warning</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#ba1a1a] font-semibold">
                Pendente de Assinatura
              </span>
              <span className="text-[28px] font-bold text-[#ba1a1a] tracking-tight leading-none mt-1">
                {countByStatus.sem_assinatura}
              </span>
              <span className="text-[11px] text-[#45464d] mt-1">Aguardando rubricas</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ba1a1a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">draw</span>
            </div>
          </div>
        </div>

        {/* Filter Toolbar & Tab Bar */}
        <div className="p-4 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-3">
          {/* Segmented Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-gray-100">
            <button
              type="button"
              onClick={() => setActiveFilterTab('todos')}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeFilterTab === 'todos'
                  ? 'bg-[#0051d5] text-white shadow-sm'
                  : 'text-[#45464d] hover:bg-[#eff4ff]'
              }`}
            >
              <span>Todos</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                {countByStatus.todos}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilterTab('vigente')}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeFilterTab === 'vigente'
                  ? 'bg-[#0051d5] text-white shadow-sm'
                  : 'text-[#45464d] hover:bg-[#eff4ff]'
              }`}
            >
              <span>Vigentes</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                {countByStatus.vigente}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilterTab('avencer')}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeFilterTab === 'avencer'
                  ? 'bg-[#0051d5] text-white shadow-sm'
                  : 'text-[#45464d] hover:bg-[#eff4ff]'
              }`}
            >
              <span>A Vencer em 30/60 dias</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px]">
                {countByStatus.avencer}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilterTab('sem_assinatura')}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeFilterTab === 'sem_assinatura'
                  ? 'bg-[#0051d5] text-white shadow-sm'
                  : 'text-[#45464d] hover:bg-[#eff4ff]'
              }`}
            >
              <span>Sem Assinatura</span>
              <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-red-800 text-[10px]">
                {countByStatus.sem_assinatura}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilterTab('expirado')}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeFilterTab === 'expirado'
                  ? 'bg-[#0051d5] text-white shadow-sm'
                  : 'text-[#45464d] hover:bg-[#eff4ff]'
              }`}
            >
              <span>Expirados</span>
              <span className="px-1.5 py-0.2 rounded-full bg-gray-200 text-gray-700 text-[10px]">
                {countByStatus.expirado}
              </span>
            </button>
          </div>

          {/* Search and Filters Controls */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="relative flex-1 min-w-[260px]">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar por código, razão social, objeto..."
                className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#eff4ff]/60 border border-[#dce9ff] text-[13px] text-[#0b1c30] placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0051d5]/20"
              />
            </div>

            <select
              value={selectedSupplierFilter}
              onChange={(e) => setSelectedSupplierFilter(e.target.value)}
              className="h-10 px-3 rounded-xl bg-white border border-[#dce9ff] text-[13px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20 cursor-pointer"
            >
              <option value="">Todos os Fornecedores</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.razaoSocial}
                </option>
              ))}
            </select>

            <select
              className="h-10 px-3 rounded-xl bg-white border border-[#dce9ff] text-[13px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20 cursor-pointer"
            >
              <option>Todas as Vigências</option>
              <option>Vigente (Ano 2025)</option>
              <option>Expiração Próxima (Q4)</option>
            </select>

            <select
              className="h-10 px-3 rounded-xl bg-white border border-[#dce9ff] text-[13px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20 cursor-pointer"
            >
              <option>Todas as Modalidades</option>
              <option>SaaS & Nuvem</option>
              <option>Infraestrutura HW</option>
              <option>Consultoria Especializada</option>
            </select>
          </div>
        </div>

        {/* Contracts Data Table */}
        <div className="bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-[#eff4ff]/80 text-[#45464d] text-[11px] uppercase tracking-wider font-semibold border-b border-[#e5eeff]">
                  <th className="py-3 px-4">Identificação / Objeto</th>
                  <th className="py-3 px-4">Fornecedor Contratado</th>
                  <th className="py-3 px-4">Vigência & Timeline</th>
                  <th className="py-3 px-4">Status de Assinatura</th>
                  <th className="py-3 px-4">Valor Global</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    onClick={() => onSelectContract(contract)}
                    className="hover:bg-[#eff4ff]/40 transition-colors cursor-pointer group"
                  >
                    {/* Contract ID & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#eff4ff] text-[#0051d5] flex items-center justify-center shrink-0 border border-[#dce9ff]">
                          <span className="material-symbols-outlined text-[20px]">description</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-bold text-[#0b1c30] group-hover:text-[#0051d5] transition-colors truncate">
                              {contract.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono mt-0.5">
                            <span className="font-bold text-[#0051d5]">{contract.code}</span>
                            <span>•</span>
                            <span>{contract.internalId}</span>
                            {contract.hasOcr && (
                              <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 text-[9px] font-semibold border border-purple-200">
                                OCR Validado
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Supplier */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-[12px] font-semibold text-[#0b1c30]">
                          {contract.supplierName}
                        </span>
                        <span className="text-[11px] font-mono text-gray-500">
                          {contract.supplierCnpj}
                        </span>
                      </div>
                    </td>

                    {/* Timeline & Progress */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 w-44">
                        <div className="flex justify-between text-[11px] text-gray-600">
                          <span>
                            {contract.startDate.slice(0, 7)} a {contract.endDate.slice(0, 7)}
                          </span>
                          <span
                            className={`font-bold ${
                              contract.remainingDays <= 45 ? 'text-[#b45309]' : 'text-gray-700'
                            }`}
                          >
                            {contract.remainingDays > 0 ? `${contract.remainingDays}d` : 'Expirado'}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#eff4ff] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              contract.status === 'expirado'
                                ? 'bg-gray-400'
                                : contract.remainingDays <= 45
                                ? 'bg-[#f59e0b]'
                                : 'bg-[#0051d5]'
                            }`}
                            style={{ width: `${Math.min(100, contract.progressPercent)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Signature Status Badge */}
                    <td className="py-3 px-4">
                      {contract.status === 'vigente' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#059669] text-[11px] font-bold border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                          Assinado Digitalmente
                        </span>
                      )}
                      {contract.status === 'avencer' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-[#d97706] text-[11px] font-bold border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-pulse"></span>
                          A Vencer (Risco)
                        </span>
                      )}
                      {contract.status === 'sem_assinatura' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-[#ba1a1a] text-[11px] font-bold border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
                          Sem Assinatura
                        </span>
                      )}
                      {contract.status === 'expirado' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[11px] font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Instrumento Expirado
                        </span>
                      )}
                    </td>

                    {/* Total Value */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-[#0b1c30]">
                          R$ {contract.totalValue.toLocaleString('pt-BR')},00
                        </span>
                        {contract.monthlyValue && (
                          <span className="text-[11px] text-gray-500">
                            R$ {contract.monthlyValue.toLocaleString('pt-BR')}/mês
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          id={`btn-view-contract-${contract.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectContract(contract);
                          }}
                          className="h-8 px-2.5 rounded-lg bg-white border border-gray-200 hover:bg-[#eff4ff] text-[#0051d5] text-[12px] font-semibold transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          <span>Ver</span>
                        </button>

                        <button
                          type="button"
                          id={`btn-download-contract-${contract.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast(`Baixando PDF assinado de ${contract.code}...`);
                          }}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#0b1c30] hover:bg-gray-100 transition-colors"
                          title="Baixar PDF"
                        >
                          <span className="material-symbols-outlined text-[18px]">download</span>
                        </button>

                        {currentRole === 'administrador' && (
                          <button
                            type="button"
                            id={`btn-delete-contract-${contract.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setContractToDelete(contract);
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#ba1a1a] hover:bg-red-50 transition-colors"
                            title="Excluir contrato (Exclusivo Administrador)"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>
              Exibindo <strong>{filteredContracts.length}</strong> de{' '}
              <strong>{contracts.length}</strong> contratos registrados
            </span>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Página 1 de 1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-over Drawer: "Novo Instrumento Contratual" (Matches Image 7.png / HTML) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-gray-200 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#eff4ff]/40 sticky top-0 z-20">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#0051d5] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">post_add</span>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-[17px] font-bold text-[#0b1c30]">
                    Novo Instrumento Contratual
                  </h2>
                  <span className="text-[11px] text-gray-500">
                    Cadastro com validação automática de CNPJ e OCR
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

            {/* Drawer Form Body */}
            <form onSubmit={handleCreateSubmit} className="p-6 flex flex-col gap-4 flex-1">
              {/* AI Auto-fill Banner */}
              <div className="p-3.5 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 rounded-2xl border border-purple-200/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-purple-600 text-[22px]">auto_awesome</span>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-purple-900">
                      Preenchimento Autônomo com IA
                    </span>
                    <span className="text-[10px] text-purple-700">
                      A IA lê minutas contratuais em PDF e popula os campos
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isAiFilling}
                  onClick={handleSimulateAiFill}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 shadow-sm disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined text-[14px] ${isAiFilling ? 'animate-spin' : ''}`}>
                    {isAiFilling ? 'sync' : 'auto_fix_high'}
                  </span>
                  <span>{isAiFilling ? 'Lendo Minuta...' : 'Cadastrar com IA'}</span>
                </button>
              </div>

              {/* Vincular Fornecedor */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-[#0b1c30]">
                  Vincular Fornecedor *
                </label>
                <select
                  value={newSupplierId}
                  onChange={(e) => setNewSupplierId(e.target.value)}
                  required
                  className="h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-[13px] text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20 cursor-pointer"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.razaoSocial} ({s.cnpj})
                    </option>
                  ))}
                </select>
              </div>

              {/* Título / Objeto */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-[#0b1c30]">
                  Título / Objeto do Contrato *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Fornecimento e Licenciamento Enterprise Cloud"
                  required
                  className="h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-[13px] text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20"
                />
              </div>

              {/* Processo Interno */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-[#0b1c30]">
                  Nº do Processo / Referência Interna
                </label>
                <input
                  type="text"
                  value={newInternalId}
                  onChange={(e) => setNewInternalId(e.target.value)}
                  placeholder="#9948-25"
                  className="h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-[13px] font-mono text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20"
                />
              </div>

              {/* Datas de Vigência */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-[#0b1c30]">
                    Data de Início *
                  </label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    required
                    className="h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-[13px] text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20 cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-[#0b1c30]">
                    Data de Término *
                  </label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    required
                    className="h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-[13px] text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20 cursor-pointer"
                  />
                </div>
              </div>

              {/* Valores e Periodicidade */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-[#0b1c30]">
                    Valor Global (R$) *
                  </label>
                  <input
                    type="number"
                    value={newTotalValue}
                    onChange={(e) => setNewTotalValue(e.target.value)}
                    required
                    min="1"
                    className="h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-[13px] font-mono text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-[#0b1c30]">
                    Periodicidade
                  </label>
                  <select
                    value={newPeriodicity}
                    onChange={(e) => setNewPeriodicity(e.target.value as any)}
                    className="h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-[13px] text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20 cursor-pointer"
                  >
                    <option value="mensal">Mensal</option>
                    <option value="anual">Anual</option>
                    <option value="demanda">Por Demanda</option>
                    <option value="plurianual">Plurianual</option>
                  </select>
                </div>
              </div>

              {/* Upload do Documento / Drag & Drop */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-[#0b1c30]">
                  Minuta / Contrato Digitalizado (PDF)
                </label>
                <div
                  onClick={() => {
                    setIsUploading(true);
                    setTimeout(() => {
                      setIsUploading(false);
                      setUploadedFileName('Minuta_Contratual_OCR_Assinada.pdf');
                      showToast('Documento anexado com verificação OCR!');
                    }, 800);
                  }}
                  className="p-4 border-2 border-dashed border-gray-300 hover:border-[#0051d5] rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-gray-50/60 hover:bg-[#eff4ff]/40"
                >
                  <span className="material-symbols-outlined text-[32px] text-[#0051d5]">
                    cloud_upload
                  </span>
                  <span className="text-[12px] font-bold text-gray-700 mt-1">
                    {uploadedFileName || 'Solte o arquivo PDF aqui ou clique para selecionar'}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    Processamento OCR e extração por IA automáticos
                  </span>
                </div>
              </div>

              {/* Campo E-mail de notificação */}
              <div className="flex flex-col gap-1.5 p-3.5 bg-[#f8fafc] rounded-2xl border border-gray-200/80">
                <label htmlFor="input-new-notification-email" className="text-[12px] font-bold text-[#0b1c30] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#0051d5]">forward_to_inbox</span>
                    E-mail de notificação
                  </span>
                  <span className="text-[10px] text-[#0051d5] font-semibold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                    Alertas Automáticos
                  </span>
                </label>
                <div className="relative">
                  <input
                    id="input-new-notification-email"
                    type="email"
                    required
                    value={newNotificationEmail}
                    onChange={(e) => setNewNotificationEmail(e.target.value)}
                    placeholder="ex: gestor.contratos@empresa.com.br"
                    className="w-full h-10 px-3.5 pl-9 rounded-xl border border-gray-300 text-[13px] text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20 focus:border-[#0051d5] bg-white font-medium"
                  />
                  <span className="material-symbols-outlined text-[18px] text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    alternate_email
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 leading-tight mt-0.5">
                  Este endereço receberá avisos automatizados de vencimento de vigência e atualizações de status.
                </p>
              </div>

              {/* Checkbox Assinado */}
              <div className="p-3 bg-[#eff4ff]/60 rounded-xl border border-[#dce9ff] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chkSigned"
                    checked={newIsSigned}
                    onChange={(e) => setNewIsSigned(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0051d5] focus:ring-[#0051d5] cursor-pointer"
                  />
                  <label htmlFor="chkSigned" className="text-[12px] font-semibold text-[#0b1c30] cursor-pointer">
                    Contrato já está assinado digitalmente?
                  </label>
                </div>
                <span className="text-[10px] text-gray-500">
                  {newIsSigned ? 'ICP-Brasil / DocuSign' : 'Entra na fila de rubricas'}
                </span>
              </div>

              {/* Footer Actions */}
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
                  <span>Salvar Contrato</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generic Confirmation Modal for Contract Deletion */}
      <ConfirmationModal
        isOpen={!!contractToDelete}
        onClose={() => setContractToDelete(null)}
        onConfirm={() => {
          if (!contractToDelete) return;
          setIsDeletingContract(true);
          setTimeout(() => {
            if (onDeleteContract) {
              onDeleteContract(contractToDelete.id);
            }
            showToast(`Contrato ${contractToDelete.code} excluído com sucesso.`);
            setIsDeletingContract(false);
            setContractToDelete(null);
          }, 300);
        }}
        isLoading={isDeletingContract}
        title="Excluir Instrumento Contratual"
        message={
          <>
            Tem certeza de que deseja remover o contrato{' '}
            <strong className="text-slate-900 font-mono font-bold">
              {contractToDelete?.code}
            </strong>
            ? Esta operação revoga o cadastro e remove o instrumento da esteira de gestão ativa.
          </>
        }
        confirmText="Sim, Excluir Contrato"
        cancelText="Cancelar"
        variant="danger"
        icon="delete_forever"
        destructiveNotice="Atenção: A exclusão é irreversível. Todos os termos aditivos, histórico de alertas e parâmetros de SLA vinculados serão permanentemente desativados."
        itemDetails={
          contractToDelete
            ? [
                { label: 'Código do Contrato', value: contractToDelete.code, highlighted: true },
                { label: 'Objeto / Título', value: contractToDelete.title },
                { label: 'Fornecedor', value: contractToDelete.supplierName },
                {
                  label: 'Valor Global',
                  value: `R$ ${contractToDelete.totalValue.toLocaleString('pt-BR')},00`,
                },
                { label: 'Data de Término', value: contractToDelete.endDate },
              ]
            : []
        }
      />

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
