import React, { useState, useEffect } from 'react';
import {
  Contract,
  Supplier,
  UserRole,
  SystemSettings,
  NotificationItem,
} from './types';
import {
  initialContracts,
  initialSuppliers,
  initialSettings,
  initialNotifications,
} from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ContractsListView } from './components/ContractsListView';
import { ContractDetailView } from './components/ContractDetailView';
import { SuppliersView } from './components/SuppliersView';
import { SettingsView } from './components/SettingsView';
import { SearchModal } from './components/SearchModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'contratos' | 'fornecedores' | 'configuracoes'>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('administrador');
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [settings, setSettings] = useState<SystemSettings>(initialSettings);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  // Search & Modals
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewContractDrawerOpen, setIsNewContractDrawerOpen] = useState(false);

  // Global keyboard shortcut (Ctrl+K or ⌘K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddNewContract = (newContractData: Partial<Contract>) => {
    const createdContract: Contract = {
      id: newContractData.id || `ctr-${Date.now()}`,
      code: newContractData.code || `CTR-2025-${Math.floor(100 + Math.random() * 900)}`,
      internalId: newContractData.internalId || `#${Math.floor(1000 + Math.random() * 9000)}-25`,
      title: newContractData.title || 'Novo Instrumento Contratual',
      supplierId: newContractData.supplierId || suppliers[0].id,
      supplierName: newContractData.supplierName || suppliers[0].razaoSocial,
      supplierCnpj: newContractData.supplierCnpj || suppliers[0].cnpj,
      category: newContractData.category || 'Tecnologia / SaaS',
      startDate: newContractData.startDate || '2025-05-01',
      endDate: newContractData.endDate || '2026-05-01',
      totalDays: newContractData.totalDays || 365,
      remainingDays: newContractData.remainingDays || 365,
      totalValue: newContractData.totalValue || 120000,
      monthlyValue: newContractData.monthlyValue,
      periodicity: newContractData.periodicity || 'mensal',
      status: newContractData.status || 'vigente',
      signatureStatus: newContractData.signatureStatus || 'Assinado Digitalmente',
      hasOcr: newContractData.hasOcr ?? true,
      progressPercent: newContractData.progressPercent || 2,
      isSigned: newContractData.isSigned ?? true,
      signers: newContractData.signers || [],
      attachments: newContractData.attachments || [],
      aiInsights: newContractData.aiInsights || {
        executiveSummary: 'Novo contrato em fase de homologação.',
        items: [],
      },
    };

    setContracts((prev) => [createdContract, ...prev]);
  };

  const handleAddSupplier = (newSupplier: Supplier) => {
    setSuppliers((prev) => [newSupplier, ...prev]);
  };

  const handleSelectSupplierContracts = (supplierId: string) => {
    setActiveTab('contratos');
    // Contracts list will receive current state
  };

  return (
    <div className="flex h-screen w-full bg-[#f7f9fd] text-[#0b1c30] font-sans overflow-hidden antialiased select-none selection:bg-[#0051d5] selection:text-white">
      {/* Permanent Enterprise Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedContract(null);
          setActiveTab(tab);
        }}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        onOpenNewContract={() => {
          setActiveTab('contratos');
          setIsNewContractDrawerOpen(true);
        }}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Enterprise Top Header */}
        <Header
          currentRole={currentRole}
          notifications={notifications}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          onOpenNewContract={() => {
            setActiveTab('contratos');
            setIsNewContractDrawerOpen(true);
          }}
          onSelectNotificationContract={(contractId) => {
            const found = contracts.find((c) => c.id === contractId || c.code === contractId);
            if (found) {
              setSelectedContract(found);
            }
          }}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
          {selectedContract ? (
            <ContractDetailView
              contract={selectedContract}
              onBack={() => setSelectedContract(null)}
              currentRole={currentRole}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  contracts={contracts}
                  suppliers={suppliers}
                  onSelectContract={(contract) => setSelectedContract(contract)}
                  onViewAllContracts={() => setActiveTab('contratos')}
                  onOpenNewContract={() => {
                    setActiveTab('contratos');
                    setIsNewContractDrawerOpen(true);
                  }}
                />
              )}

              {activeTab === 'contratos' && (
                <ContractsListView
                  contracts={contracts}
                  suppliers={suppliers}
                  onSelectContract={(contract) => setSelectedContract(contract)}
                  onAddNewContract={handleAddNewContract}
                  isDrawerOpen={isNewContractDrawerOpen}
                  setIsDrawerOpen={setIsNewContractDrawerOpen}
                />
              )}

              {activeTab === 'fornecedores' && (
                <SuppliersView
                  suppliers={suppliers}
                  onAddSupplier={handleAddSupplier}
                  onSelectSupplierContracts={handleSelectSupplierContracts}
                />
              )}

              {activeTab === 'configuracoes' && (
                <SettingsView
                  settings={settings}
                  onUpdateSettings={setSettings}
                  notifications={notifications}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Quick Global Search Modal (⌘K) */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        contracts={contracts}
        suppliers={suppliers}
        onSelectContract={(contract) => setSelectedContract(contract)}
        onSelectSupplier={(supplierId) => {
          setActiveTab('fornecedores');
        }}
      />
    </div>
  );
}
