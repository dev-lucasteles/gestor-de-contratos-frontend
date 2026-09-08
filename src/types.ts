export type UserRole = 'administrador' | 'gestor' | 'operacional';

export type ContractStatus = 'vigente' | 'avencer' | 'sem_assinatura' | 'expirado';

export interface Signer {
  id: string;
  name: string;
  role: string;
  cpf: string;
  signed: boolean;
  signedAt?: string;
  avatarInitials: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  addedAt: string;
  type: 'pdf' | 'doc';
  description?: string;
}

export interface AiInsight {
  topic: string;
  summary: string;
  icon: string;
}

export interface Contract {
  id: string;
  code: string;
  internalId: string;
  title: string;
  supplierId: string;
  supplierName: string;
  supplierCnpj: string;
  category: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  remainingDays: number;
  totalValue: number;
  monthlyValue?: number;
  periodicity: 'mensal' | 'anual' | 'demanda' | 'plurianual';
  status: ContractStatus;
  signatureStatus: string;
  hasOcr: boolean;
  progressPercent: number;
  riskCritical?: boolean;
  isSigned: boolean;
  signedDate?: string;
  signingMethod?: string;
  notes?: string;
  signers: Signer[];
  attachments: Attachment[];
  aiInsights: {
    executiveSummary: string;
    items: AiInsight[];
    criticalRisk?: string;
  };
}

export interface Supplier {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  inscricaoEstadual: string;
  contactName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
  activities: string[];
  riskLevel: 'baixo' | 'medio' | 'alto';
  activeContractsCount: number;
  totalFinancialVolume: number;
  status: 'ativo' | 'homologacao' | 'bloqueado';
  statusReason?: string;
  syncDate?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  type: 'expiracao' | 'assinatura' | 'fornecedor' | 'risco_ia';
  contractCode?: string;
  read: boolean;
  urgent?: boolean;
  badgeText?: string;
  actionText?: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  detail: string;
  timestamp: string;
  type: 'add' | 'permission' | 'warning';
}

export interface SystemSettings {
  notice30Days: boolean;
  notice60Days: boolean;
  signaturePending7Days: boolean;
  aiRiskInstantAlert: boolean;
  legalEmail: string;
  financeEmail: string;
  smtpStatus: 'conectado' | 'desconectado';
  slackWebhookStatus: 'ativo' | 'inativo';
  smsStatus: 'opcional' | 'ativo';
  rbacMatrix: {
    module: string;
    subtext: string;
    admin: boolean;
    gestor: boolean;
    operacional: boolean | 'leitura';
  }[];
}
