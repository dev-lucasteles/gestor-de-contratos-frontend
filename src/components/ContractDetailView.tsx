import React, { useState, useEffect } from 'react';
import { Contract, ContractStatus, UserRole } from '../types';
import { ConfirmationModal } from './ConfirmationModal';

interface ContractDetailViewProps {
  contract: Contract;
  onBack: () => void;
  onEdit?: (contract: Contract) => void;
  onDeleteContract?: (contractId: string) => void;
  onViewAuditTrail?: (contractCode: string) => void;
  onUpdateContract?: (updatedContract: Contract) => void;
  onSimulateAlert?: (
    contract: Contract,
    triggerType: 'vencimento' | 'mudanca_status',
    options?: { newStatus?: ContractStatus; daysRemaining?: number; customEmail?: string }
  ) => void;
  currentRole?: UserRole;
}

export const ContractDetailView: React.FC<ContractDetailViewProps> = ({
  contract,
  onBack,
  onEdit,
  onDeleteContract,
  onViewAuditTrail,
  onUpdateContract,
  onSimulateAlert,
  currentRole,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSummary, setAiSummary] = useState(contract.aiInsights.executiveSummary);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTabPrompt, setActiveTabPrompt] = useState<'briefing' | 'qa'>('briefing');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);

  // Notification email & alerts state
  const [notificationEmail, setNotificationEmail] = useState(
    contract.notificationEmail || 'gestor.contratos@empresa.com.br'
  );
  const [notifyOnExpiration, setNotifyOnExpiration] = useState(
    contract.notifyOnExpiration ?? true
  );
  const [notifyOnStatusChange, setNotifyOnStatusChange] = useState(
    contract.notifyOnStatusChange ?? true
  );
  const [isSavingNotification, setIsSavingNotification] = useState(false);
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [simulatedStatus, setSimulatedStatus] = useState<ContractStatus>(
    contract.status === 'expirado' ? 'vigente' : 'expirado'
  );
  const [simulatedDaysRemaining, setSimulatedDaysRemaining] = useState(
    contract.remainingDays || 15
  );

  useEffect(() => {
    setNotificationEmail(contract.notificationEmail || 'gestor.contratos@empresa.com.br');
    setNotifyOnExpiration(contract.notifyOnExpiration ?? true);
    setNotifyOnStatusChange(contract.notifyOnStatusChange ?? true);
    setIsEmailChanged(false);
  }, [contract.id, contract.notificationEmail]);

  const handleSaveNotificationSettings = () => {
    if (!notificationEmail.trim()) {
      showToast('Por favor, informe um endereço de e-mail de notificação válido.');
      return;
    }
    setIsSavingNotification(true);
    const updatedContract: Contract = {
      ...contract,
      notificationEmail: notificationEmail.trim(),
      notifyOnExpiration,
      notifyOnStatusChange,
    };
    if (onUpdateContract) {
      onUpdateContract(updatedContract);
    }
    setTimeout(() => {
      setIsSavingNotification(false);
      setIsEmailChanged(false);
      showToast('E-mail de notificação salvo e ativado para este contrato!');
    }, 350);
  };

  const handleSimulateAlertTrigger = (triggerType: 'vencimento' | 'mudanca_status') => {
    if (onSimulateAlert) {
      onSimulateAlert(contract, triggerType, {
        newStatus: simulatedStatus,
        daysRemaining: simulatedDaysRemaining,
        customEmail: notificationEmail.trim(),
      });
    } else {
      showToast(`Disparo de alerta (${triggerType}) simulado com sucesso!`);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReanalyzeAi = () => {
    setIsAnalyzing(true);
    showToast('Inteligência Artificial reanalisando cláusulas e termos aditivos...');
    setTimeout(() => {
      setIsAnalyzing(false);
      setAiSummary(
        'Análise Jurídica Atualizada: Cláusula 4 revisada com conformidade SLA 99.95%. Riscos de repactuação atenuados caso a notificação formal seja expedida até 15/Nov.'
      );
      showToast('Análise de IA concluída com sucesso!');
    }, 1800);
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setIsAskingAi(true);
    const q = aiQuestion.trim().toLowerCase();

    setTimeout(() => {
      setIsAskingAi(false);
      if (q.includes('rescis') || q.includes('multa')) {
        setAiAnswer(
          'De acordo com a Cláusula 2.2 e 3.4, a multa rescisória é de 10% sobre o saldo vincendo remanescente, dispensada caso ocorra aviso prévio por escrito com 60 dias de antecedência.'
        );
      } else if (q.includes('sla') || q.includes('disponibilidade')) {
        setAiAnswer(
          'O SLA acordado na Cláusula 4.1 é de 99.95% de disponibilidade mensal. Em caso de quebra, haverá crédito automático progressivo de 5% a 20% na fatura seguinte.'
        );
      } else if (q.includes('renova') || q.includes('venc')) {
        setAiAnswer(
          'A renovação automática está expressamente DESATIVADA (Cláusula 2.1). O término é em 28/04/2025. Um novo Termo Aditivo deve ser assinado até 45 dias antes do encerramento.'
        );
      } else {
        setAiAnswer(
          `Parecer Jurídico do Instrumento ${contract.code}: Para a solicitação informada, o contrato estabelece foro na Comarca de São Paulo/SP, conformidade com a LGPD (Lei 13.709/18) e obrigações técnicas de suporte 24/7.`
        );
      }
      setAiQuestion('');
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="p-6 flex flex-col gap-5 w-full max-w-[1600px] mx-auto animate-in fade-in duration-300">
        {/* Top Breadcrumb & Metadata Classification */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[12px] text-[#45464d]">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1 text-[#0051d5] hover:underline font-semibold"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Voltar aos Contratos</span>
            </button>
            <span className="text-gray-300">•</span>
            <span className="font-mono text-gray-500 font-semibold">{contract.code}</span>
            <span className="text-gray-300">•</span>
            <span className="truncate max-w-sm text-gray-700">{contract.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold border border-[#ba1a1a]/20">
              <span className="material-symbols-outlined text-[13px]">policy</span>
              Classificação: Nível 1 Crítico
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#eff4ff] text-[#0051d5] text-[11px] font-medium border border-[#dce9ff]">
              <span className="material-symbols-outlined text-[13px]">lock</span>
              Criptografado SHA-256
            </span>
          </div>
        </div>

        {/* Contract Header & Action Bar */}
        <div className="p-5 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0051d5]/10 text-[#0051d5] flex items-center justify-center shrink-0 border border-[#0051d5]/15">
              <span className="material-symbols-outlined text-[28px]">article</span>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-[22px] font-bold text-[#0b1c30] tracking-tight leading-tight">
                  {contract.title}
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-[#eff4ff] text-[#0051d5] text-[12px] font-mono font-bold">
                  {contract.code}
                </span>
                <span className="text-[12px] text-gray-400 font-mono">{contract.internalId}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#45464d] mt-1">
                <span className="font-semibold text-[#0b1c30]">{contract.supplierName}</span>
                <span>•</span>
                <span className="font-mono text-[12px]">CNPJ: {contract.supplierCnpj}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[#059669] text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  Fornecedor Homologado
                </span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => showToast('Iniciando download do PDF assinado original (com carimbo de tempo ICP-Brasil)...')}
              className="h-9 px-3.5 rounded-xl bg-white text-[#0b1c30] text-[13px] font-semibold border border-[#e5eeff] hover:bg-[#eff4ff] shadow-sm transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Baixar PDF Original</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('Link seguro copiado para a área de transferência!')}
              className="h-9 px-3.5 rounded-xl bg-white text-[#0b1c30] text-[13px] font-semibold border border-[#e5eeff] hover:bg-[#eff4ff] shadow-sm transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              <span>Compartilhar</span>
            </button>

            {currentRole !== 'visualizador' && (
              <button
                type="button"
                id="btn-trigger-alert-toolbar"
                onClick={() => handleSimulateAlertTrigger('vencimento')}
                className="h-9 px-3.5 rounded-xl bg-amber-50 text-amber-900 text-[13px] font-semibold border border-amber-200 hover:bg-amber-100 shadow-sm transition-all flex items-center gap-1.5"
                title="Simular disparo de alerta transacional por e-mail"
              >
                <span className="material-symbols-outlined text-[18px] text-amber-600">notifications_active</span>
                <span>Simular Alerta E-mail</span>
              </button>
            )}

            {onEdit && currentRole !== 'visualizador' && (
              <button
                type="button"
                id="btn-edit-contract-detail"
                onClick={() => onEdit(contract)}
                className="h-9 px-3.5 rounded-xl bg-[#eff4ff] text-[#0051d5] text-[13px] font-semibold border border-[#dce9ff] hover:bg-[#dce9ff] transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                <span>Editar Metadados</span>
              </button>
            )}

            {onDeleteContract && currentRole === 'administrador' && (
              <button
                type="button"
                id="btn-delete-contract-detail"
                onClick={() => setShowDeleteModal(true)}
                className="h-9 px-3 rounded-xl bg-white text-[#ba1a1a] text-[13px] font-semibold border border-red-200 hover:bg-red-50 transition-all flex items-center gap-1.5"
                title="Excluir Contrato (Exclusivo Administrador)"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                <span className="hidden sm:inline">Excluir</span>
              </button>
            )}

            {/* More Menu Dropdown - only shown if user has additional options available */}
            {currentRole !== 'visualizador' && (
              <div className="relative">
                <button
                  type="button"
                  id="btn-more-options-detail"
                  onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
                  className="h-9 w-9 rounded-xl bg-white text-gray-600 border border-[#e5eeff] hover:bg-[#eff4ff] shadow-sm transition-all flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[20px]">more_vert</span>
                </button>

                {showOptionsDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-[#e5eeff] p-1.5 z-50 animate-in fade-in">
                    {currentRole === 'administrador' && (
                      <button
                        onClick={() => {
                          setShowOptionsDropdown(false);
                          if (onViewAuditTrail) {
                            onViewAuditTrail(contract.code);
                          } else {
                            showToast(`Trilha de auditoria criptográfica de ${contract.code} exibida`);
                          }
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] text-gray-700 hover:bg-[#eff4ff] transition-colors text-left"
                      >
                        <span className="material-symbols-outlined text-[18px] text-[#0051d5]">history</span>
                        <span>Trilha de Auditoria</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        showToast('Iniciando minuta de 1º Termo Aditivo...');
                        setShowOptionsDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] text-gray-700 hover:bg-[#eff4ff] transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#0051d5]">note_add</span>
                      <span>Criar Termo Aditivo</span>
                    </button>

                    <button
                      onClick={() => {
                        showToast('Alertas configurados para 45, 30 e 15 dias');
                        setShowOptionsDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] text-gray-700 hover:bg-[#eff4ff] transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-[18px] text-amber-500">notifications_active</span>
                      <span>Ajustar Alertas</span>
                    </button>

                    {currentRole === 'administrador' && (
                      <>
                        <div className="my-1 border-t border-gray-100"></div>
                        <button
                          onClick={() => {
                            showToast('Processo de rescisão aberto para análise jurídica.');
                            setShowOptionsDropdown(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] text-[#ba1a1a] hover:bg-red-50 transition-colors text-left font-medium"
                        >
                          <span className="material-symbols-outlined text-[18px]">cancel</span>
                          <span>Rescindir Contrato</span>
                        </button>
                        {onDeleteContract && (
                          <button
                            onClick={() => {
                              setShowOptionsDropdown(false);
                              setShowDeleteModal(true);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] text-[#ba1a1a] hover:bg-red-50 transition-colors text-left font-semibold"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                            <span>Excluir Contrato</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 2-Column Split View: Left Document Preview & Right AI Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Simulated PDF Reader (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {/* PDF Toolbar */}
            <div className="px-4 py-2.5 bg-[#131b2e] text-white rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl text-[12px]">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="hover:text-[#316bf3] disabled:opacity-30 flex items-center"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <span className="font-mono font-medium px-1">
                    {currentPage} / 14
                  </span>
                  <button
                    type="button"
                    disabled={currentPage >= 14}
                    onClick={() => setCurrentPage((p) => Math.min(14, p + 1))}
                    className="hover:text-[#316bf3] disabled:opacity-30 flex items-center"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>

                <div className="h-4 w-[1px] bg-white/20"></div>

                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <span className="material-symbols-outlined text-[15px]">lock_clock</span>
                  ICP-Brasil Válido
                </span>
              </div>

              {/* Zoom & View Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                  className="p-1 rounded hover:bg-white/10 text-gray-300"
                  title="Diminuir Zoom"
                >
                  <span className="material-symbols-outlined text-[18px]">zoom_out</span>
                </button>
                <span className="text-[11px] font-mono text-gray-300 w-9 text-center">
                  {zoomLevel}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                  className="p-1 rounded hover:bg-white/10 text-gray-300"
                  title="Aumentar Zoom"
                >
                  <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                </button>

                <div className="h-4 w-[1px] bg-white/20 mx-1"></div>

                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1 rounded hover:bg-white/10 text-gray-300"
                  title="Girar 90º"
                >
                  <span className="material-symbols-outlined text-[18px]">rotate_right</span>
                </button>

                <button
                  type="button"
                  onClick={() => showToast('Busca ativada no corpo do documento OCR.')}
                  className="p-1 rounded hover:bg-white/10 text-gray-300"
                  title="Buscar no texto"
                >
                  <span className="material-symbols-outlined text-[18px]">find_in_page</span>
                </button>

                <button
                  type="button"
                  onClick={() => showToast('Modo tela cheia')}
                  className="p-1 rounded hover:bg-white/10 text-gray-300"
                  title="Tela cheia"
                >
                  <span className="material-symbols-outlined text-[18px]">fullscreen</span>
                </button>
              </div>
            </div>

            {/* Virtual A4 Sheet Container */}
            <div className="relative bg-[#cbd5e1]/40 rounded-2xl p-6 flex justify-center overflow-x-auto min-h-[720px] shadow-inner border border-gray-200/60">
              <div
                className="w-full max-w-[620px] bg-white rounded-lg shadow-2xl p-10 flex flex-col justify-between text-gray-800 transition-all select-text relative"
                style={{
                  transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                  transformOrigin: 'top center',
                }}
              >
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none rotate-[-35deg]">
                  <span className="text-[48px] font-black tracking-widest text-[#0051d5]">
                    MAIS CONTRATOS • GRUPO RIOMAIS
                  </span>
                </div>

                {/* Document Header */}
                <div className="flex flex-col border-b-2 border-gray-900 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[28px] text-gray-900">gavel</span>
                      <span className="text-[12px] font-extrabold uppercase tracking-widest text-gray-900">
                        Instrumento Particular Registrado
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-gray-600">
                      Livro B • Fls. 112 • Reg. Nº 2024-019
                    </span>
                  </div>
                  <h2 className="text-[16px] font-bold text-center mt-4 text-gray-950 uppercase tracking-tight">
                    CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE COMPUTAÇÃO EM NUVEM E INFRAESTRUTURA DEDICADA
                  </h2>
                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono mt-1">
                    <span>CÓDIGO ÚNICO: {contract.code}</span>
                    <span>ORIGEM: BRASIL - RJ/SP</span>
                  </div>
                </div>

                {/* Legal Body / Clauses */}
                <div className="flex flex-col gap-4 text-[12px] leading-relaxed text-gray-700 py-4">
                  <p className="font-serif text-justify indent-6">
                    Pelo presente instrumento particular, de um lado{' '}
                    <strong>GRUPO RIOMAIS S.A.</strong>, inscrita no CNPJ sob o nº 48.912.834/0001-09, doravante denominada <em>CONTRATANTE</em>, e de outro lado{' '}
                    <strong>AMAZON WEB SERVICES BRASIL LTDA.</strong>, inscrita no CNPJ sob o nº 23.456.789/0001-12, doravante denominada <em>CONTRATADA</em>, têm entre si justo e avençado o que segue:
                  </p>

                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-gray-900 uppercase text-[11px] tracking-wide">
                      CLÁUSULA PRIMEIRA – DO OBJETO
                    </h3>
                    <p className="font-serif text-justify indent-6">
                      1.1. Constitui objeto do presente instrumento o fornecimento continuado e licenciamento de serviços corporativos em nuvem pública escalável (AWS Enterprise Infrastructure), contemplando instâncias elásticas de processamento, clusters redundantes Kubernetes, bancos de dados relacionais de alta disponibilidade e suporte técnico em regime de 24x7x365 com tempo de primeiro atendimento máximo de 15 (quinze) minutos para incidentes de severidade crítica.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-gray-900 uppercase text-[11px] tracking-wide">
                      CLÁUSULA SEGUNDA – DA VIGÊNCIA E RESCISÃO
                    </h3>
                    <p className="font-serif text-justify indent-6">
                      2.1. O prazo de vigência deste contrato é de 24 (vinte e quatro) meses, iniciando-se em 28 de abril de 2023 e encerrando-se impreterivelmente em 28 de abril de 2025.
                    </p>
                    <p className="font-serif text-justify indent-6 bg-amber-50/70 p-1.5 rounded border-l-2 border-amber-500 text-amber-950 font-medium">
                      2.2. O presente contrato NÃO goza de renovação tácita automática. Qualquer continuidade demandará a formalização prévia de Termo Aditivo até 45 (quarenta e cinco) dias antes do término de vigência.
                    </p>
                    <p className="font-serif text-justify indent-6">
                      2.3. A rescisão imotivada por iniciativa de qualquer das partes exigirá notificação por escrito com antecedência mínima de 60 (sessenta) dias, sob pena de multa de 10% (dez por cento) calculada sobre o saldo restante das parcelas contratuais vincendas.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-gray-900 uppercase text-[11px] tracking-wide">
                      CLÁUSULA TERCEIRA – DO PREÇO E FATURAMENTO
                    </h3>
                    <p className="font-serif text-justify indent-6">
                      3.1. Pela prestação dos serviços contratados, a CONTRATANTE pagará à CONTRATADA o valor global fixo de R$ 720.000,00 (setecentos e vinte mil reais), a ser quitado em 24 (vinte e quatro) parcelas mensais e sucessivas no valor de R$ 30.000,00 (trinta mil reais), com vencimento no 5º (quinto) dia útil de cada mês.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-gray-900 uppercase text-[11px] tracking-wide">
                      CLÁUSULA QUARTA – DO NÍVEL DE SERVIÇO (SLA) E PROTEÇÃO DE DADOS
                    </h3>
                    <p className="font-serif text-justify indent-6">
                      4.1. A CONTRATADA garante disponibilidade mensal mínima (SLA) de 99,95% (noventa e nove vírgula noventa e cinco por cento).
                    </p>
                  </div>
                </div>

                {/* Digital Signature Seal Box */}
                <div className="mt-4 pt-3 border-t-2 border-gray-900 flex items-center justify-between bg-gray-50/80 p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#0051d5] text-white flex items-center justify-center font-serif font-black text-lg shadow-sm">
                      §
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-gray-900 uppercase">
                        Documento Assinado Digitalmente
                      </span>
                      <span className="text-[9px] font-mono text-gray-500">
                        Padrão ICP-Brasil MP nº 2.200-2/2001 • Carimbo do Tempo ACT
                      </span>
                      <span className="text-[9px] font-mono text-gray-400">
                        Hash SHA-256: 9b8823f49...e2a981c701
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      2/2 Assinaturas Válidas
                    </span>
                    <span className="text-[9px] text-gray-400 font-mono mt-0.5">
                      Auditado em 28/04/2023
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {[1, 2, 3, 4].map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-16 w-12 rounded-lg border flex flex-col items-center justify-between p-1 transition-all ${
                    currentPage === page
                      ? 'border-[#0051d5] bg-[#eff4ff] ring-2 ring-[#0051d5]/30'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="w-full h-10 bg-gray-100 rounded-sm flex items-center justify-center text-[9px] text-gray-400">
                    pág {page}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-gray-600">{page}</span>
                </button>
              ))}
              <div className="h-16 px-3 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-[11px] text-gray-500 font-medium">
                +10 Anexos Técnicos
              </div>
            </div>
          </div>

          {/* Right Column: Key Details, AI Summary, Parties & Attachments (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Status & Validity Header Card */}
            <div className="p-4 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fffbeb] text-[#b45309] text-[12px] font-bold border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  Vigente (Expira em {contract.remainingDays} dias)
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[#059669] text-[12px] font-bold">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Assinado Digitalmente (2 de 2)
                </span>
              </div>

              {/* Financial Hero Value */}
              <div className="p-3 bg-[#eff4ff]/60 rounded-xl flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-wider text-[#45464d] font-semibold">
                    Valor Global do Instrumento
                  </span>
                  <span className="text-[26px] font-extrabold text-[#0b1c30] tracking-tight leading-none mt-0.5">
                    R$ {contract.totalValue.toLocaleString('pt-BR')},00
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#45464d] block">Faturamento</span>
                  <span className="text-[13px] font-bold text-[#0051d5]">
                    R$ {contract.monthlyValue ? contract.monthlyValue.toLocaleString('pt-BR') : '30.000'},00/mês
                  </span>
                </div>
              </div>

              {/* Validity Progress & Dates */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex justify-between text-[11px] text-[#45464d]">
                  <span>
                    Início: <strong className="text-[#0b1c30]">28/04/2023</strong>
                  </span>
                  <span>
                    Término: <strong className="text-[#9a3412]">28/04/2025</strong>
                  </span>
                </div>
                <div className="w-full h-2 bg-[#eff4ff] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0051d5] to-[#f59e0b] rounded-full transition-all duration-500"
                    style={{ width: `${contract.progressPercent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-[#76777d]">
                  <span>Transcorrido: {contract.progressPercent}%</span>
                  <span className="text-[#b45309] font-semibold">
                    Restam {contract.remainingDays} dias (5.8%)
                  </span>
                </div>
              </div>
            </div>

            {/* Notification Settings & Alert Simulator Card - Hidden for visualizador */}
            {currentRole !== 'visualizador' && (
              <div id="contract-notification-settings-card" className="p-4 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0051d5]">
                      <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-[#0b1c30]">Notificações & Alertas do Contrato</h4>
                      <span className="text-[10px] text-gray-500">Configuração de e-mail e simulação de disparos</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[#059669] text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Canal Ativo
                  </span>
                </div>

                {/* Notification Email Field */}
                <div className="flex flex-col gap-1.5 bg-[#f8fafc] p-3 rounded-xl border border-gray-200/70">
                  <label htmlFor="input-contract-notification-email" className="text-[11px] font-bold text-[#0b1c30] flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-gray-500">mail</span>
                      E-mail de notificação
                    </span>
                    {isEmailChanged && (
                      <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Alteração pendente
                      </span>
                    )}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="input-contract-notification-email"
                      type="email"
                      value={notificationEmail}
                      onChange={(e) => {
                        setNotificationEmail(e.target.value);
                        setIsEmailChanged(true);
                      }}
                      placeholder="ex: gestor.contratos@empresa.com.br"
                      className="flex-1 h-9 px-3 rounded-xl bg-white border border-gray-300 text-[12px] text-[#0b1c30] font-medium focus:outline-none focus:ring-2 focus:ring-[#0051d5]/20 focus:border-[#0051d5]"
                    />
                    <button
                      type="button"
                      id="btn-save-contract-notification-email"
                      onClick={handleSaveNotificationSettings}
                      disabled={isSavingNotification}
                      className="h-9 px-3.5 rounded-xl bg-[#0051d5] hover:bg-[#003ea8] disabled:opacity-50 text-white text-[12px] font-bold transition-all flex items-center gap-1 shrink-0 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>{isSavingNotification ? 'Salvando...' : 'Salvar'}</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight">
                    Os alertas automáticos de vencimento e alterações de status deste instrumento serão roteados para este endereço.
                  </p>

                  {/* Preferences Checkboxes */}
                  <div className="pt-2 border-t border-gray-200/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <label className="flex items-center gap-1.5 text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyOnExpiration}
                        onChange={(e) => {
                          setNotifyOnExpiration(e.target.checked);
                          setIsEmailChanged(true);
                        }}
                        className="w-3.5 h-3.5 rounded text-[#0051d5] focus:ring-[#0051d5]"
                      />
                      <span>Alertar vencimento (&lt; 30d)</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyOnStatusChange}
                        onChange={(e) => {
                          setNotifyOnStatusChange(e.target.checked);
                          setIsEmailChanged(true);
                        }}
                        className="w-3.5 h-3.5 rounded text-[#0051d5] focus:ring-[#0051d5]"
                      />
                      <span>Alertar mudança de status</span>
                    </label>
                  </div>
                </div>

                {/* Simulation Trigger Controls */}
                <div className="flex flex-col gap-2 pt-1 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#0b1c30] uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-purple-600">bolt</span>
                      Simulação de Disparo de Alerta
                    </span>
                    <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full font-bold">
                      SMTP Simulator
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Botão Simular Vencimento */}
                    <button
                      type="button"
                      id="btn-simulate-expiration-alert"
                      onClick={() => handleSimulateAlertTrigger('vencimento')}
                      className="p-2.5 rounded-xl bg-amber-50/80 hover:bg-amber-100 border border-amber-200 text-amber-900 flex flex-col items-start gap-1 transition-all text-left group shadow-sm"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold">
                          <span className="material-symbols-outlined text-[16px] text-amber-600 group-hover:scale-110 transition-transform">
                            notification_important
                          </span>
                          Alerta de Vencimento
                        </span>
                        <span className="text-[10px] bg-amber-200/80 px-1.5 py-0.2 rounded font-mono font-bold">
                          {contract.remainingDays}d
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-700 leading-tight">
                        Disparar e-mail de término de vigência para <strong className="font-mono">{notificationEmail}</strong>
                      </span>
                    </button>

                    {/* Botão Simular Mudança de Status */}
                    <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200 flex flex-col gap-1.5 shadow-sm">
                      <div className="flex items-center justify-between w-full">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-900">
                          <span className="material-symbols-outlined text-[16px] text-[#0051d5]">
                            sync_alt
                          </span>
                          Mudança de Status
                        </span>
                        <span className="text-[9px] text-[#0051d5] font-bold uppercase bg-white px-1.5 py-0.2 rounded border border-blue-200">
                          Atual: {contract.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <select
                          id="select-simulated-status"
                          value={simulatedStatus}
                          onChange={(e) => setSimulatedStatus(e.target.value as ContractStatus)}
                          className="flex-1 h-7 px-2 rounded-lg bg-white border border-blue-200 text-[11px] text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#0051d5]"
                        >
                          <option value="vigente">Vigente</option>
                          <option value="avencer">A Vencer</option>
                          <option value="sem_assinatura">Sem Assinatura</option>
                          <option value="expirado">Expirado</option>
                        </select>
                        <button
                          type="button"
                          id="btn-simulate-status-change"
                          onClick={() => handleSimulateAlertTrigger('mudanca_status')}
                          className="h-7 px-2.5 rounded-lg bg-[#0051d5] hover:bg-[#003ea8] text-white text-[10px] font-bold flex items-center gap-0.5 shrink-0 transition-colors shadow-xs"
                        >
                          <span>Disparar</span>
                          <span className="material-symbols-outlined text-[13px]">send</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Contract Intelligence Block (Violet Gradient Theme) */}
            <div className="p-5 bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#1e1b4b] text-white rounded-2xl shadow-xl border border-purple-800/40 flex flex-col gap-4 relative overflow-hidden">
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-purple-500/20 blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-200">
                    <span className="material-symbols-outlined text-[18px]">neurology</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-white tracking-tight flex items-center gap-1.5">
                      AI Contract Intelligence
                      <span className="px-1.5 py-0.2 rounded bg-purple-400/20 text-purple-200 text-[9px] font-semibold tracking-wider uppercase">
                        Gemini 2.5
                      </span>
                    </span>
                    <span className="text-[10px] text-purple-200/70">
                      Resumo Executivo Jurídico Gerado por IA
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-black/20 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setActiveTabPrompt('briefing')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                      activeTabPrompt === 'briefing' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:text-white'
                    }`}
                  >
                    Briefing
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTabPrompt('qa')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                      activeTabPrompt === 'qa' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:text-white'
                    }`}
                  >
                    Perguntar à IA
                  </button>
                </div>
              </div>

              {activeTabPrompt === 'briefing' ? (
                <>
                  <p className="text-[12px] text-purple-100/90 leading-relaxed bg-white/[0.06] p-3 rounded-xl border border-white/10">
                    {aiSummary}
                  </p>

                  {/* Structured AI Clause Items */}
                  <div className="flex flex-col gap-2">
                    {contract.aiInsights.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 hover:border-purple-400/30 transition-all flex items-start gap-2.5"
                      >
                        <span className="material-symbols-outlined text-purple-300 text-[18px] shrink-0 mt-0.5">
                          {item.icon}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-[12px] font-bold text-white">{item.topic}</span>
                          <span className="text-[11px] text-purple-200/80 mt-0.5">{item.summary}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Critical Risk Warning */}
                  {contract.aiInsights.criticalRisk && (
                    <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl flex items-start gap-2.5 text-red-200">
                      <span className="material-symbols-outlined text-red-400 text-[20px] shrink-0 mt-0.5">
                        crisis_alert
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">
                          Risco Crítico Identificado pela IA
                        </span>
                        <p className="text-[11px] text-red-100/90 mt-0.5">
                          {contract.aiInsights.criticalRisk}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* AI Action Buttons */}
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <button
                      type="button"
                      disabled={isAnalyzing}
                      onClick={handleReanalyzeAi}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50"
                    >
                      <span className={`material-symbols-outlined text-[16px] ${isAnalyzing ? 'animate-spin' : ''}`}>
                        {isAnalyzing ? 'sync' : 'auto_awesome'}
                      </span>
                      <span>{isAnalyzing ? 'Analisando Cláusulas...' : 'Solicitar Nova Análise'}</span>
                    </button>

                    <div className="flex items-center gap-3 text-purple-300">
                      <button
                        onClick={() => showToast('Histórico de 3 análises de IA')}
                        className="hover:underline hover:text-white"
                      >
                        Histórico (3)
                      </button>
                      <button
                        onClick={() => showToast('Briefing Jurídico em PDF exportado com sucesso!')}
                        className="hover:underline hover:text-white flex items-center gap-0.5"
                      >
                        <span className="material-symbols-outlined text-[14px]">picture_as_pdf</span>
                        <span>Exportar Briefing</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Interactive Q&A with Contract Assistant */
                <div className="flex flex-col gap-3">
                  <p className="text-[11px] text-purple-200/80">
                    Faça qualquer pergunta jurídica ou operacional sobre as cláusulas deste contrato.
                  </p>

                  <form onSubmit={handleAskQuestion} className="flex flex-col gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={aiQuestion}
                        onChange={(e) => setAiQuestion(e.target.value)}
                        placeholder="Ex: Qual a multa de rescisão? Tem renovação automática?"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-purple-400/30 text-white text-[12px] placeholder:text-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <button
                        type="submit"
                        disabled={isAskingAi || !aiQuestion.trim()}
                        className="absolute right-1.5 top-1.5 px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[11px] font-bold hover:bg-purple-500 disabled:opacity-40"
                      >
                        {isAskingAi ? 'Buscando...' : 'Consultar'}
                      </button>
                    </div>
                  </form>

                  {/* Answer display */}
                  {aiAnswer && (
                    <div className="p-3 rounded-xl bg-purple-900/40 border border-purple-500/30 text-[12px] text-purple-100 animate-in fade-in">
                      <div className="flex items-center gap-1.5 font-bold text-purple-300 text-[11px] mb-1">
                        <span className="material-symbols-outlined text-[14px]">psychology</span>
                        Resposta Fundamentada da IA
                      </div>
                      <p className="leading-relaxed">{aiAnswer}</p>
                    </div>
                  )}

                  {/* Suggested questions */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setAiQuestion('Qual a multa por rescisão antecipada?')}
                      className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-purple-200 text-[10px]"
                    >
                      Qual a multa de rescisão?
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiQuestion('Qual o SLA e métrica de disponibilidade?')}
                      className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-purple-200 text-[10px]"
                    >
                      Qual o SLA acordado?
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiQuestion('Existe renovação automática?')}
                      className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-purple-200 text-[10px]"
                    >
                      Renovação automática?
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Signers Block */}
            <div className="p-4 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#0b1c30]">
                  Partes Signatárias ({contract.signers.length}/2)
                </span>
                <span className="text-[11px] text-[#059669] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  ICP-Brasil Válido
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {contract.signers.map((signer) => (
                  <div
                    key={signer.id}
                    className="p-2.5 rounded-xl bg-[#eff4ff]/60 border border-[#dce9ff]/60 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#0051d5] text-white font-bold text-xs flex items-center justify-center">
                        {signer.avatarInitials}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-[#0b1c30]">{signer.name}</span>
                        <span className="text-[10px] text-[#76777d]">{signer.role}</span>
                        <span className="text-[9px] font-mono text-gray-400">CPF: {signer.cpf}</span>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        <span className="material-symbols-outlined text-[12px]">check</span>
                        Assinado
                      </span>
                      {signer.signedAt && (
                        <span className="text-[9px] text-gray-400 mt-0.5">{signer.signedAt}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attachments and Addenda Block */}
            <div className="p-4 bg-white rounded-2xl border border-[#e5eeff] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#0b1c30]">
                  Anexos e Aditivos ({contract.attachments.length})
                </span>
                <button
                  type="button"
                  onClick={() => showToast('Abrindo assistente para anexar novo documento...')}
                  className="text-[11px] text-[#0051d5] hover:underline font-bold flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  Adicionar Anexo
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {contract.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="p-2.5 rounded-xl border border-[#e5eeff] hover:bg-[#eff4ff]/60 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#ffdad6]/60 text-[#ba1a1a] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[12px] font-semibold text-[#0b1c30] truncate">{att.name}</span>
                        <span className="text-[10px] text-gray-500">
                          {att.size} • Adicionado em {att.addedAt}
                          {att.description && ` • ${att.description}`}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => showToast(`Baixando ${att.name}...`)}
                      className="p-1 rounded-lg text-gray-500 hover:text-[#0051d5] hover:bg-white"
                      title="Download"
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Deletion in Detail View */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          setIsDeleting(true);
          setTimeout(() => {
            if (onDeleteContract) {
              onDeleteContract(contract.id);
            }
            setIsDeleting(false);
            setShowDeleteModal(false);
            onBack();
          }, 350);
        }}
        isLoading={isDeleting}
        title="Excluir Contrato em Visualização"
        message={
          <>
            Você tem certeza de que deseja excluir permanentemente o contrato{' '}
            <strong className="text-slate-900 font-mono font-bold">
              {contract.code}
            </strong>
            ? Você será redirecionado para a listagem principal após a confirmação.
          </>
        }
        confirmText="Sim, Excluir Instrumento"
        cancelText="Cancelar"
        variant="danger"
        icon="delete_forever"
        destructiveNotice="Atenção: Esta ação não pode ser desfeita. Todos os metadados, arquivos OCR e pareceres de IA vinculados a este contrato serão removidos."
        itemDetails={[
          { label: 'Código do Contrato', value: contract.code, highlighted: true },
          { label: 'Título / Objeto', value: contract.title },
          { label: 'Fornecedor', value: contract.supplierName },
          {
            label: 'Valor Global',
            value: `R$ ${contract.totalValue.toLocaleString('pt-BR')},00`,
          },
          { label: 'Período', value: `${contract.startDate} a ${contract.endDate}` },
        ]}
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
