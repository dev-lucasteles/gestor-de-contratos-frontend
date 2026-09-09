import {
  Contract,
  Supplier,
  NotificationItem,
  AuditLog,
  SystemSettings,
  UserAccountItem,
  UserProfile,
  ApiKeyItem,
  WebhookItem,
  IntegrationConnector,
  GranularPermission,
} from '../types';
import { ASSETS } from '../constants/assets';

export const INITIAL_SUPPLIERS: Supplier[] = [];

export const INITIAL_CONTRACTS: Contract[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];

export const INITIAL_USERS: UserAccountItem[] = [
  {
    id: 'usr-lucas-teles',
    name: 'Lucas Teles',
    email: 'lucas.teles@gruporiomais.com.br',
    department: 'Diretoria Jurídica & Governança',
    role: 'administrador',
    status: 'ativo',
    twoFactorEnabled: true,
    lastLogin: 'Hoje'
  }
];

export const INITIAL_API_KEYS: ApiKeyItem[] = [];

export const INITIAL_WEBHOOKS: WebhookItem[] = [];

export const INITIAL_INTEGRATIONS: IntegrationConnector[] = [
  {
    id: 'int-docusign',
    name: 'DocuSign & Clicksign Enterprise',
    category: 'assinatura',
    icon: 'draw',
    description: 'Gestão de envelopes digitais, carimbo de tempo ICP-Brasil e trilha probatória jurídica.',
    connected: false,
    statusText: 'Não conectado',
    lastSync: '—'
  },
  {
    id: 'int-sap',
    name: 'SAP S/4HANA & TOTVS Protheus',
    category: 'erp',
    icon: 'hub',
    description: 'Sincronização bidirecional de pedidos de compra (PO), centros de custo e medições financeiras.',
    connected: false,
    statusText: 'Não conectado',
    lastSync: '—'
  },
  {
    id: 'int-slack',
    name: 'Slack & Microsoft Teams',
    category: 'comunicacao',
    icon: 'chat',
    description: 'Alertas automáticos de vencimento e canal interativo para aprovação rápida de alçadas.',
    connected: false,
    statusText: 'Não conectado',
    lastSync: '—'
  },
  {
    id: 'int-storage',
    name: 'Google Workspace & SharePoint',
    category: 'storage',
    icon: 'cloud_sync',
    description: 'Espelhamento automático e imutável das minutas e aditivos com hash SHA-256 no repositório.',
    connected: false,
    statusText: 'Não conectado',
    lastSync: '—'
  }
];

export const INITIAL_SETTINGS: SystemSettings = {
  darkMode: false,
  notice30Days: true,
  notice60Days: true,
  signaturePending7Days: true,
  aiRiskInstantAlert: true,
  legalEmail: 'juridico.corporativo@empresa.com.br',
  financeEmail: 'controladoria.contratos@empresa.com.br',
  smtpStatus: 'conectado',
  slackWebhookStatus: 'ativo',
  smsStatus: 'opcional',
  // Security settings
  twoFactorRequired: true,
  ssoEnabled: true,
  sessionTimeoutMinutes: 30,
  ipWhitelistEnabled: false,
  ipWhitelist: '189.40.112.0/24, 201.86.72.0/24',
  passwordExpirationDays: 90,
  // General settings
  companyName: 'Grupo RioMais S.A.',
  companyCnpj: '48.912.834/0001-09',
  contractPrefix: 'CTR-2025-',
  currency: 'BRL (R$)',
  timezone: 'América/São Paulo (GMT-3)',
  // Approval tiers
  tier1Limit: 50000,
  tier2Limit: 250000,
  requireDualSignatureAbove: 500000,
  granularPermissions: [
    // Contratos & Minutas
    {
      id: 'perm-contracts-view',
      category: 'contratos',
      name: 'Visualizar Contratos e Metadados',
      description: 'Consulta aos instrumentos vigentes, anexos arquivados, vigência e valores',
      administrador: 'total',
      editor: 'total',
      visualizador: 'leitura'
    },
    {
      id: 'perm-contracts-create',
      category: 'contratos',
      name: 'Cadastrar Novos Contratos',
      description: 'Criação de novos registros contratuais, upload de minutas originais e definição de prazos',
      administrador: 'total',
      editor: 'total',
      visualizador: 'bloqueado'
    },
    {
      id: 'perm-contracts-edit',
      category: 'contratos',
      name: 'Editar Metadados e Cláusulas',
      description: 'Alteração de valores, renovação de vigência, reajustes monetários e dados de fornecedor',
      administrador: 'total',
      editor: 'total',
      visualizador: 'bloqueado'
    },
    {
      id: 'perm-contracts-addendum',
      category: 'contratos',
      name: 'Elaborar Termos Aditivos',
      description: 'Criação e incorporação de minutas de aditivos com histórico de repactuação financeira',
      administrador: 'total',
      editor: 'total',
      visualizador: 'bloqueado'
    },
    {
      id: 'perm-contracts-delete',
      category: 'contratos',
      name: 'Excluir & Rescindir Contratos',
      description: 'Exclusão definitiva ou rescisão motivada de contratos e expurgo de minutas',
      administrador: 'total',
      editor: 'bloqueado',
      visualizador: 'bloqueado'
    },
    {
      id: 'perm-contracts-export',
      category: 'contratos',
      name: 'Exportar Relatórios & PDFs',
      description: 'Download de relatórios executivos em PDF/CSV e minutas integrais com assinaturas',
      administrador: 'total',
      editor: 'total',
      visualizador: 'total'
    },

    // Fornecedores & Terceiros
    {
      id: 'perm-suppliers-view',
      category: 'fornecedores',
      name: 'Consultar Diretório de Fornecedores',
      description: 'Acesso a CNPJs, certidões fiscais, contatos e score de risco de fornecedores',
      administrador: 'total',
      editor: 'total',
      visualizador: 'leitura'
    },
    {
      id: 'perm-suppliers-manage',
      category: 'fornecedores',
      name: 'Cadastrar & Atualizar Fornecedores',
      description: 'Inclusão de novas empresas parceiras, alteração de contas e certidões negativas',
      administrador: 'total',
      editor: 'total',
      visualizador: 'bloqueado'
    },
    {
      id: 'perm-suppliers-compliance',
      category: 'fornecedores',
      name: 'Homologação e Bloqueio de Compliance',
      description: 'Aprovação formal de conformidade LGPD/ESG e bloqueio administrativo de fornecedores',
      administrador: 'total',
      editor: 'total',
      visualizador: 'bloqueado'
    },

    // Assinaturas & Fluxos
    {
      id: 'perm-signatures-send',
      category: 'assinaturas',
      name: 'Enviar Envelopes para Assinatura',
      description: 'Disparo de minutas para signatários via DocuSign, Clicksign ou fluxo interno',
      administrador: 'total',
      editor: 'total',
      visualizador: 'bloqueado'
    },
    {
      id: 'perm-signatures-sign',
      category: 'assinaturas',
      name: 'Assinar com Certificado ICP-Brasil (A1/A3)',
      description: 'Aposição de assinatura digital com validade jurídica pelo signatário responsável',
      administrador: 'total',
      editor: 'total',
      visualizador: 'bloqueado'
    },
    {
      id: 'perm-signatures-cancel',
      category: 'assinaturas',
      name: 'Revogar & Anular Envelopes',
      description: 'Cancelamento definitivo de fluxo de assinatura em andamento',
      administrador: 'total',
      editor: 'bloqueado',
      visualizador: 'bloqueado'
    },

    // Inteligência Jurídica & IA
    {
      id: 'perm-ai-insights',
      category: 'ia_juridica',
      name: 'Consultar Pareceres & Análises de IA',
      description: 'Acesso aos insights preditivos, detecção de cláusulas de risco e resumos executivos',
      administrador: 'total',
      editor: 'total',
      visualizador: 'leitura'
    },
    {
      id: 'perm-ai-reanalyze',
      category: 'ia_juridica',
      name: 'Reanalisar Minutas com Motor Neural',
      description: 'Disparar reprocessamento com IA e OCR avançado em PDFs recém-anexados',
      administrador: 'total',
      editor: 'total',
      visualizador: 'bloqueado'
    },

    // Governança, Segurança & Administração
    {
      id: 'perm-gov-users',
      category: 'governanca',
      name: 'Gerenciamento de Usuários & Papéis (RBAC)',
      description: 'Convidar colaboradores, alterar permissões granulares e suspender acessos',
      administrador: 'total',
      editor: 'bloqueado',
      visualizador: 'bloqueado'
    },
    {
      id: 'perm-gov-api',
      category: 'governanca',
      name: 'Gestão de Chaves de API & Webhooks',
      description: 'Criação de tokens REST, rotação de chaves e configuração de webhooks corporativos',
      administrador: 'total',
      editor: 'bloqueado',
      visualizador: 'bloqueado'
    },
    {
      id: 'perm-gov-audit',
      category: 'governanca',
      name: 'Acesso à Trilha de Auditoria (Audit Logs)',
      description: 'Visualização de logs de segurança, carimbos de tempo, IPs e exportação pericial',
      administrador: 'total',
      editor: 'bloqueado',
      visualizador: 'bloqueado'
    },
    {
      id: 'perm-gov-security',
      category: 'governanca',
      name: 'Políticas de Segurança (2FA, SSO & IPs)',
      description: 'Configurações de obrigatoriedade de 2FA, provedores SAML/SSO e faixas de IP permitidas',
      administrador: 'total',
      editor: 'bloqueado',
      visualizador: 'bloqueado'
    }
  ],
  rbacMatrix: [
    {
      module: 'Cadastro de Fornecedores & Upload',
      subtext: 'Inserir dados básicos, certidões e minutas preliminares',
      admin: true,
      editor: true,
      visualizador: 'leitura'
    },
    {
      module: 'Homologação e Validação Cadastral',
      subtext: 'Aprovação técnica de novos fornecedores e checagem fiscal',
      admin: true,
      editor: true,
      visualizador: false
    },
    {
      module: 'Aprovação de Alçadas & Parecer Jurídico',
      subtext: 'Assinatura formal de aditivos e liberação orçamentária',
      admin: true,
      editor: true,
      visualizador: false
    },
    {
      module: 'Relatórios Estratégicos & Exportação TCO',
      subtext: 'Acesso a volumetria, saving negociado e previsão de gastos',
      admin: true,
      editor: true,
      visualizador: 'leitura'
    },
    {
      module: 'Configurações Globais & Parâmetros de IA',
      subtext: 'Chaves de API, webhooks e redefinição de gatilhos',
      admin: true,
      editor: false,
      visualizador: false
    },
    {
      module: 'Exclusão Definitiva & Trilha de Auditoria',
      subtext: 'Expurgo de registros contratuais e consulta a logs criptográficos',
      admin: true,
      editor: false,
      visualizador: false
    }
  ]
};

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-lucas-teles',
  name: 'Lucas Teles',
  email: 'lucas.teles@gruporiomais.com.br',
  phone: '+55 (11) 98765-4321',
  avatarUrl: ASSETS.carlosAvatar,
  department: 'Jurídico Corporativo & Compliance',
  jobTitle: 'Diretor Jurídico & CLO',
  role: 'administrador',
  documentNumber: 'OAB/SP 412.980',
  documentType: 'OAB',
  timezone: 'America/Sao_Paulo (UTC-03:00)',
  language: 'pt-BR',
  bio: 'Especialista em Direito Digital, Contratos de Tecnologia e Governança Corporativa. Responsável pela aprovação de minutas, alçadas e conformidade do Grupo RioMais.',
  twoFactorEnabled: true,
  icpCertificate: {
    status: 'ativo',
    type: 'e-CPF A1',
    issuer: 'Autoridade Certificadora Certisign Brasil v5',
    serialNumber: '58:A2:3E:91:BB:72:04:8F:12',
    validUntil: '2027-11-15',
    thumbprint: 'SHA256: 4F:9C:21:8A:77:33:0B:EE:12:89:D4:56:FE:78:AB:19',
  },
  signatureInitials: 'LT',
  signatureStyle: 'rubrica_estilizada',
  notifications: {
    emailAlerts: true,
    contractExpirationAlerts: true,
    statusChangeAlerts: true,
    aiRiskAlerts: true,
    weeklyDigest: true,
    browserPush: true,
  },
};

export const initialContracts = INITIAL_CONTRACTS;
export const initialSuppliers = INITIAL_SUPPLIERS;
export const initialSettings = INITIAL_SETTINGS;
export const initialNotifications = INITIAL_NOTIFICATIONS;
export const initialAuditLogs = INITIAL_AUDIT_LOGS;
export const initialUsers = INITIAL_USERS;
export const initialApiKeys = INITIAL_API_KEYS;
export const initialWebhooks = INITIAL_WEBHOOKS;
export const initialIntegrations = INITIAL_INTEGRATIONS;
export const initialGranularPermissions = INITIAL_SETTINGS.granularPermissions || [];
export const initialUserProfile = INITIAL_USER_PROFILE;
