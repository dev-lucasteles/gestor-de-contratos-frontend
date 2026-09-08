import React from 'react';
import { Contract, Supplier } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  contracts: Contract[];
  suppliers: Supplier[];
  onSelectContract: (contract: Contract) => void;
  onSelectSupplier: (supplierId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  searchTerm,
  setSearchTerm,
  contracts,
  suppliers,
  onSelectContract,
  onSelectSupplier,
}) => {
  if (!isOpen) return null;

  const filteredContracts = contracts.filter((c) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.code.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.supplierName.toLowerCase().includes(q) ||
      c.supplierCnpj.includes(q)
    );
  }).slice(0, 5);

  const filteredSuppliers = suppliers.filter((s) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      s.razaoSocial.toLowerCase().includes(q) ||
      s.nomeFantasia.toLowerCase().includes(q) ||
      s.cnpj.includes(q)
    );
  }).slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#e5eeff] overflow-hidden animate-in zoom-in-95">
        {/* Search Input */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <span className="material-symbols-outlined text-gray-400 text-[22px]">search</span>
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite para buscar contratos, CNPJ, fornecedor ou cláusula..."
            className="w-full text-[14px] text-[#0b1c30] placeholder:text-gray-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 rounded-lg bg-gray-100 text-gray-500 text-[11px] font-mono hover:bg-gray-200"
          >
            ESC
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-4 flex flex-col gap-4">
          {/* Contratos Section */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400">
              Contratos Encontrados ({filteredContracts.length})
            </span>
            <div className="flex flex-col gap-1.5">
              {filteredContracts.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectContract(c);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl hover:bg-[#eff4ff] transition-colors cursor-pointer flex items-center justify-between border border-transparent hover:border-[#dce9ff]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#0051d5] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">description</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-bold text-[#0b1c30] truncate">{c.title}</span>
                      <span className="text-[11px] text-gray-500 font-mono">
                        {c.code} • {c.supplierName}
                      </span>
                    </div>
                  </div>
                  <span className="text-[12px] font-bold text-[#0b1c30] shrink-0">
                    R$ {c.totalValue.toLocaleString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Fornecedores Section */}
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
            <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400">
              Fornecedores ({filteredSuppliers.length})
            </span>
            <div className="flex flex-col gap-1.5">
              {filteredSuppliers.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    onSelectSupplier(s.id);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl hover:bg-[#eff4ff] transition-colors cursor-pointer flex items-center justify-between border border-transparent hover:border-[#dce9ff]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#0051d5] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">domain</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-bold text-[#0b1c30] truncate">{s.razaoSocial}</span>
                      <span className="text-[11px] text-gray-500 font-mono">CNPJ: {s.cnpj}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#059669] text-[10px] font-semibold">
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <span>Use as setas ou clique para selecionar</span>
          <span className="font-mono">Pressione ESC para fechar</span>
        </div>
      </div>
    </div>
  );
};
