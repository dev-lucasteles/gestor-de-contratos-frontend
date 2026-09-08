import React, { useState, useRef, useEffect } from 'react';
import { ASSETS } from '../constants/assets';
import { NotificationItem, UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onNewContractClick: () => void;
  onNavigateContract?: (code: string) => void;
  notifications: NotificationItem[];
  onMarkNotificationsRead: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  breadcrumb?: { section: string; page: string };
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onNewContractClick,
  onNavigateContract,
  notifications,
  onMarkNotificationsRead,
  searchQuery,
  setSearchQuery,
  breadcrumb = { section: 'Workspace', page: 'Operações Contratuais' },
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-[#f8f9ff]/90 backdrop-blur-xl border-b border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] z-40 flex items-center justify-between px-6">
      {/* Breadcrumb & Search */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5 text-[12px] text-[#45464d]">
          <span className="material-symbols-outlined text-[18px] text-[#76777d]">folder_open</span>
          <span>{breadcrumb.section}</span>
          <span className="material-symbols-outlined text-[14px] text-[#c6c6cd]">chevron_right</span>
          <span className="text-[12px] text-[#0b1c30] font-semibold truncate max-w-xs">{breadcrumb.page}</span>
        </div>

        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-2.5 text-[#76777d] text-[18px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar contratos, CNPJ, fornecedor... ⌘K"
            className="w-80 h-9 pl-8 pr-3 rounded-xl bg-[#eff4ff] text-[13px] text-[#0b1c30] placeholder:text-[#45464d]/70 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0051d5]/20 border border-transparent focus:border-[#0051d5]/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-gray-400 hover:text-gray-600 text-xs"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center gap-4">
        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-[#45464d] hover:bg-[#dce9ff]/60 hover:text-[#0b1c30] transition-colors"
            title="Notificações"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white"></span>
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-[#e5eeff] p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-[#0b1c30]">Notificações</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#0051d5] text-white text-[10px] font-bold">
                      {unreadCount} novas
                    </span>
                  )}
                </div>
                <button
                  onClick={onMarkNotificationsRead}
                  className="text-[11px] text-[#0051d5] hover:underline font-semibold"
                >
                  Marcar lidas
                </button>
              </div>

              <div className="flex flex-col gap-2 mt-2 max-h-96 overflow-y-auto pr-0.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.contractCode && onNavigateContract) {
                        onNavigateContract(n.contractCode);
                        setShowNotifications(false);
                      }
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer group ${
                      n.read ? 'bg-[#eff4ff]/40 border-transparent' : 'bg-white border-[#e5eeff] shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          n.type === 'expiracao'
                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                            : n.type === 'assinatura'
                            ? 'bg-[#dce9ff] text-[#0051d5]'
                            : 'bg-[#dbe1ff] text-[#00174b]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {n.type === 'expiracao' ? 'timelapse' : n.type === 'assinatura' ? 'draw' : 'domain_add'}
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[12px] font-bold text-[#0b1c30] truncate group-hover:text-[#0051d5] transition-colors">
                            {n.title}
                          </span>
                          <span className="text-[10px] text-[#76777d] shrink-0">{n.timeAgo}</span>
                        </div>
                        <p className="text-[11px] text-[#45464d] line-clamp-2 mt-0.5">{n.description}</p>
                        {n.badgeText && (
                          <div className="mt-1.5 flex items-center gap-2">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                n.urgent
                                  ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                  : 'bg-[#e5eeff] text-[#0051d5]'
                              }`}
                            >
                              {n.badgeText}
                            </span>
                            {n.actionText && (
                              <span className="text-[10px] text-[#0051d5] font-semibold group-hover:underline">
                                {n.actionText}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-100 text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-[#0051d5] font-semibold hover:underline"
                >
                  Fechar Central
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Novo Contrato CTA Button */}
        <button
          type="button"
          onClick={onNewContractClick}
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-[#0051d5] text-white text-[13px] font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.12)] hover:bg-[#003ea8] active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Novo Contrato</span>
        </button>

        <div className="h-6 w-[1px] bg-[#dce9ff]"></div>

        {/* User Profile Avatar with Direct Image from HTML */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-1 cursor-pointer group select-none"
          >
            <div className="relative">
              {!avatarError ? (
                <img
                  alt="Carlos Mendonça"
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-[#0051d5]/20 shadow-sm group-hover:ring-[#0051d5] transition-all"
                  src={ASSETS.carlosAvatar}
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#0051d5] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  CM
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white"></span>
            </div>

            <div className="flex flex-col text-left">
              <span className="text-[12px] font-bold text-[#0b1c30] group-hover:text-[#0051d5] transition-colors leading-tight">
                Carlos Mendonça
              </span>
              <span className="text-[10px] text-[#76777d] capitalize">
                {currentRole === 'administrador' ? 'Administrador Geral' : currentRole}
              </span>
            </div>
            <span className="material-symbols-outlined text-[#76777d] text-[18px]">expand_more</span>
          </div>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-[#e5eeff] p-1.5 z-50 animate-in fade-in">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-[12px] font-bold text-[#0b1c30]">Carlos Mendonça</p>
                <p className="text-[10px] text-gray-500">carlos.mendonca@contractflow.com</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] text-gray-700 hover:bg-[#eff4ff] transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[16px] text-gray-500">badge</span>
                  <span>Meu Perfil</span>
                </button>
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] text-gray-700 hover:bg-[#eff4ff] transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[16px] text-gray-500">lock</span>
                  <span>Chaves de Acesso & ICP</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
