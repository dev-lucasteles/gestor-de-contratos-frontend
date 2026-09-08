import { Contract, Supplier, NotificationItem, AuditLog, SystemSettings } from '../types';

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'aws',
    cnpj: '23.456.789/0001-12',
    razaoSocial: 'Amazon Web Services Brasil Ltda.',
    nomeFantasia: 'AWS Brasil',
    inscricaoEstadual: '114.839.201.110',
    contactName: 'Rodrigo Lima Silveira',
    contactRole: 'VP Enterprise Services',
    contactEmail: 'rodrigo.silveira@amazon.com',
    contactPhone: '+55 (11) 3958-4000',
    activities: ['Serviços de TI', 'Software SaaS', 'Infraestrutura'],
    riskLevel: 'baixo',
    activeContractsCount: 2,
    totalFinancialVolume: 1200000,
    status: 'ativo',
    syncDate: 'Hoje às 14:32'
  },
  {
    id: 'telefonica',
    cnpj: '02.558.157/0001-62',
    razaoSocial: 'Telefônica Brasil S.A.',
    nomeFantasia: 'Vivo Empresas • Telecom & Cloud',
    inscricaoEstadual: '108.345.912.001',
    contactName: 'Cláudia Valente',
    contactRole: 'Gerente de Contas Corporativas',
    contactEmail: 'claudia.valente@telefonica.com',
    contactPhone: '+55 (11) 98112-9900',
    activities: ['Serviços de TI', 'Conectividade', 'Software SaaS'],
    riskLevel: 'baixo',
    activeContractsCount: 4,
    totalFinancialVolume: 1840000,
    status: 'ativo',
    syncDate: 'Ontem às 11:20'
  },
  {
    id: 'cybershield',
    cnpj: '34.912.804/0001-11',
    razaoSocial: 'CyberShield Segurança Digital Ltda',
    nomeFantasia: 'CyberShield Defense • SOC 24/7',
    inscricaoEstadual: '334.912.804.011',
    contactName: 'Alexandre Bastos',
    contactRole: 'Chief Information Security Officer',
    contactEmail: 'a.bastos@cybershield.com.br',
    contactPhone: '+55 (11) 4003-8822',
    activities: ['Segurança da Informação', 'Software SaaS', 'Serviços de TI'],
    riskLevel: 'baixo',
    activeContractsCount: 1,
    totalFinancialVolume: 720000,
    status: 'ativo',
    syncDate: '22/Out às 09:15'
  },
  {
    id: 'atlas',
    cnpj: '18.774.920/0002-45',
    razaoSocial: 'Atlas Logística & Cargas Integradas',
    nomeFantasia: 'Atlas Cargo Express • Distribuição',
    inscricaoEstadual: '781.002.441.982',
    contactName: 'Marcelo Gusmão',
    contactRole: 'Diretor de Operações de Carga',
    contactEmail: 'marcelo@atlaslog.com.br',
    contactPhone: '+55 (19) 3844-9000',
    activities: ['Logística', 'Infraestrutura'],
    riskLevel: 'medio',
    activeContractsCount: 6,
    totalFinancialVolume: 3450000,
    status: 'homologacao',
    statusReason: 'Em checagem de certidão negativa de débitos estaduais',
    syncDate: '23/Out às 16:40'
  },
  {
    id: 'pinheiro',
    cnpj: '08.231.442/0001-70',
    razaoSocial: 'Pinheiro & Freire Sociedade de Advogados',
    nomeFantasia: 'P&F Legal • Consultoria Tributária',
    inscricaoEstadual: 'Isento',
    contactName: 'Dr. Felipe Prado Pinheiro',
    contactRole: 'Sócio Coordenador Cível & Contratos',
    contactEmail: 'felipe.pinheiro@pfadv.com.br',
    contactPhone: '+55 (11) 3144-8800',
    activities: ['Serviços Contábeis', 'Consultoria Jurídica'],
    riskLevel: 'baixo',
    activeContractsCount: 2,
    totalFinancialVolume: 490000,
    status: 'ativo',
    syncDate: '15/Out às 10:00'
  },
  {
    id: 'engenharia_sul',
    cnpj: '21.503.661/0001-98',
    razaoSocial: 'Engenharia Sul Facilities Prediais Ltda',
    nomeFantasia: 'Sul Facilities • Manutenção & Climatização',
    inscricaoEstadual: '902.441.002.122',
    contactName: 'Ricardo Meireles',
    contactRole: 'Gerente Técnico Predial',
    contactEmail: 'contato@engenhariasul.com.br',
    contactPhone: '+55 (41) 3022-7711',
    activities: ['Manutenção Predial', 'Infraestrutura'],
    riskLevel: 'alto',
    activeContractsCount: 0,
    totalFinancialVolume: 0,
    status: 'bloqueado',
    statusReason: 'Suspenso por CND Federal vencida e pendência trabalhista',
    syncDate: '01/Out às 14:00'
  },
  {
    id: 'totvs',
    cnpj: '53.117.014/0001-83',
    razaoSocial: 'TOTVS S.A. Tecnologia',
    nomeFantasia: 'TOTVS Core ERP',
    inscricaoEstadual: '112.984.773.001',
    contactName: 'Larissa Fontes',
    contactRole: 'Gerente de Contas Enterprise',
    contactEmail: 'larissa.fontes@totvs.com.br',
    contactPhone: '+55 (11) 2099-7000',
    activities: ['Software SaaS', 'Serviços de TI'],
    riskLevel: 'baixo',
    activeContractsCount: 3,
    totalFinancialVolume: 1250000,
    status: 'ativo',
    syncDate: 'Ontem às 15:45'
  },
  {
    id: 'dell',
    cnpj: '72.381.189/0001-09',
    razaoSocial: 'Dell Computadores do Brasil Ltda.',
    nomeFantasia: 'Dell Technologies',
    inscricaoEstadual: '096.345.881.002',
    contactName: 'Carlos Mendonça',
    contactRole: 'Key Account Manager',
    contactEmail: 'carlos.mendonca@dell.com',
    contactPhone: '+55 (51) 3274-5000',
    activities: ['Infraestrutura', 'Serviços de TI'],
    riskLevel: 'baixo',
    activeContractsCount: 2,
    totalFinancialVolume: 1220000,
    status: 'ativo',
    syncDate: '10/Out às 08:30'
  },
  {
    id: 'kpmg',
    cnpj: '16.435.890/0001-11',
    razaoSocial: 'KPMG Consultoria Empresarial',
    nomeFantasia: 'KPMG Auditores Independentes',
    inscricaoEstadual: 'Isento',
    contactName: 'Juliana Siqueira',
    contactRole: 'Diretora de Auditoria de Riscos',
    contactEmail: 'jsiqueira@kpmg.com.br',
    contactPhone: '+55 (11) 3940-1000',
    activities: ['Serviços Contábeis', 'Consultoria Jurídica'],
    riskLevel: 'baixo',
    activeContractsCount: 1,
    totalFinancialVolume: 310000,
    status: 'ativo',
    syncDate: '18/Out às 13:20'
  },
  {
    id: 'gupy',
    cnpj: '23.514.660/0001-44',
    razaoSocial: 'Gupy Tecnologia em Recrutamento Ltda.',
    nomeFantasia: 'Gupy Plataforma RH',
    inscricaoEstadual: '118.904.552.100',
    contactName: 'Mariana Duarte',
    contactRole: 'Customer Success Executive',
    contactEmail: 'm.duarte@gupy.com.br',
    contactPhone: '+55 (11) 4933-2100',
    activities: ['Software SaaS', 'Serviços de TI'],
    riskLevel: 'baixo',
    activeContractsCount: 1,
    totalFinancialVolume: 78200,
    status: 'ativo',
    syncDate: '20/Out às 17:00'
  }
];

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'ctr-019',
    code: 'CTR-2024-019',
    internalId: '#9948-24',
    title: 'Fornecimento e Licenciamento Enterprise Cloud',
    supplierId: 'aws',
    supplierName: 'Amazon Web Services Brasil Ltda.',
    supplierCnpj: '23.456.789/0001-12',
    category: 'Infra Cloud',
    startDate: '2023-04-28',
    endDate: '2025-04-28',
    totalDays: 730,
    remainingDays: 42,
    totalValue: 720000,
    monthlyValue: 30000,
    periodicity: 'mensal',
    status: 'avencer',
    signatureStatus: 'Assinado Digitalmente',
    hasOcr: true,
    progressPercent: 94.2,
    riskCritical: true,
    isSigned: true,
    signedDate: '2023-04-28 14:32 BRT',
    signingMethod: 'ICP-Brasil MP nº 2.200-2/2001',
    signers: [
      {
        id: 's1',
        name: 'Carlos Mendonça',
        role: 'Diretor de Operações (ContractFlow)',
        cpf: '***.382.918-**',
        signed: true,
        signedAt: '28/04/2023 às 14:32',
        avatarInitials: 'CM'
      },
      {
        id: 's2',
        name: 'Rodrigo Lima Silveira',
        role: 'VP Enterprise Services (AWS Brasil)',
        cpf: '***.901.448-**',
        signed: true,
        signedAt: '28/04/2023 às 17:15',
        avatarInitials: 'RL'
      }
    ],
    attachments: [
      {
        id: 'a1',
        name: 'Anexo I - Especificações Técnicas de Nuvem.pdf',
        size: '2.4 MB',
        addedAt: '28/04/2023',
        type: 'pdf'
      },
      {
        id: 'a2',
        name: 'Anexo II - Acordo de Confidencialidade e NDA.pdf',
        size: '1.1 MB',
        addedAt: '28/04/2023',
        type: 'pdf'
      },
      {
        id: 'a3',
        name: 'Procuração de Poderes dos Representantes.pdf',
        size: '890 KB',
        addedAt: '28/04/2023',
        type: 'pdf',
        description: 'Certificado Digital Verificado'
      }
    ],
    aiInsights: {
      executiveSummary: 'Extração e sumarização autônoma de obrigações, multas e garantias operacionais deste instrumento.',
      items: [
        {
          topic: 'Objeto Operacional & Escopo',
          summary: 'Provisionamento de cluster Kubernetes elástico, instâncias dedicadas e suporte técnico 24/7 com tempo de resposta de até 15 minutos.',
          icon: 'cloud_circle'
        },
        {
          topic: 'Rescisão Antecipada & Encargos',
          summary: 'Multa rescisória fixada em 10% do saldo residual vincendo caso rescindido unilateralmente sem aviso prévio de 60 dias.',
          icon: 'gavel'
        },
        {
          topic: 'Nível de Serviço (SLA) & Abatimentos',
          summary: 'Disponibilidade garantida de 99,95% com aplicação direta de créditos redutores de fatura em descumprimentos mensais.',
          icon: 'timer'
        },
        {
          topic: 'Obrigações e Governança LGPD',
          summary: 'Pagamento até o 5º dia útil; cláusula vinculante de auditoria periódica de privacidade de dados e criptografia em repouso.',
          icon: 'shield'
        }
      ],
      criticalRisk: 'Aviso de término em 42 dias sem renovação automática. Ação recomendada: iniciar minuta do 1º Termo Aditivo nos próximos 12 dias para evitar interrupção de infraestrutura crítica.'
    }
  },
  {
    id: 'ctr-084',
    code: 'CTR-2025-084',
    internalId: '#9948-25',
    title: 'Licenciamento Cloud AWS - Clusters Elásticos',
    supplierId: 'aws',
    supplierName: 'Amazon AWS Serviços Brasil Ltda.',
    supplierCnpj: '23.412.980/0001-44',
    category: 'Infra Cloud',
    startDate: '2025-01-15',
    endDate: '2026-01-15',
    totalDays: 365,
    remainingDays: 312,
    totalValue: 480000,
    monthlyValue: 40000,
    periodicity: 'anual',
    status: 'vigente',
    signatureStatus: 'Assinado Digitalmente',
    hasOcr: true,
    progressPercent: 25,
    isSigned: true,
    signers: [
      {
        id: 's1',
        name: 'Carlos Mendonça',
        role: 'Diretor de Operações',
        cpf: '***.382.918-**',
        signed: true,
        avatarInitials: 'CM'
      }
    ],
    attachments: [],
    aiInsights: {
      executiveSummary: 'Contrato aditivo com cobertura integral de workloads elásticos.',
      items: [
        { topic: 'SLA Uptime', summary: '99.99% para nós computacionais primários.', icon: 'verified' }
      ]
    }
  },
  {
    id: 'ctr-112',
    code: 'CTR-2024-112',
    internalId: '#8103-24',
    title: 'Suporte ERP Protheus & Manutenção de Módulos',
    supplierId: 'totvs',
    supplierName: 'TOTVS S.A. Tecnologia',
    supplierCnpj: '53.117.014/0001-83',
    category: 'ERP Core',
    startDate: '2024-04-01',
    endDate: '2025-04-30',
    totalDays: 394,
    remainingDays: 34,
    totalValue: 1250000,
    monthlyValue: 58900,
    periodicity: 'anual',
    status: 'avencer',
    signatureStatus: 'Assinado Digitalmente',
    hasOcr: true,
    progressPercent: 88,
    riskCritical: true,
    isSigned: true,
    signers: [],
    attachments: [],
    aiInsights: {
      executiveSummary: 'Reajuste pelo IPCA acumulado de 4.8% previsto para a próxima janela de repactuação.',
      items: [
        { topic: 'Reajuste', summary: 'Aplicação imediata de repactuação se não notificado em 30 dias.', icon: 'warning' }
      ],
      criticalRisk: 'Restam 34 dias para janela de não-renovação ou aceite de reajuste compulsório de 4.8%.'
    }
  },
  {
    id: 'ctr-019b',
    code: 'CTR-2025-019',
    internalId: '#0194-25',
    title: 'Auditoria & Compliance SOC 2 / LGPD',
    supplierId: 'kpmg',
    supplierName: 'KPMG Consultoria Empresarial',
    supplierCnpj: '16.435.890/0001-11',
    category: 'Consultoria / Auditoria',
    startDate: '2025-03-10',
    endDate: '2025-09-10',
    totalDays: 184,
    remainingDays: 140,
    totalValue: 310000,
    periodicity: 'demanda',
    status: 'sem_assinatura',
    signatureStatus: 'Pendente de Assinatura',
    hasOcr: true,
    progressPercent: 10,
    isSigned: false,
    notes: 'Minuta Jurídica v2.1 em análise pela diretoria executiva.',
    signers: [],
    attachments: [],
    aiInsights: {
      executiveSummary: 'Minuta sem rubrica da diretoria financeira há 8 dias úteis.',
      items: [
        { topic: 'Atraso de Assinatura', summary: 'Parado na mesa do Diretor Financeiro.', icon: 'pending_actions' }
      ]
    }
  },
  {
    id: 'ctr-055',
    code: 'CTR-2025-055',
    internalId: '#0552-25',
    title: 'Licenças Microsoft 365 Copilot Enterprise',
    supplierId: 'microsoft',
    supplierName: 'Microsoft Informática Ltda.',
    supplierCnpj: '60.316.817/0001-03',
    category: 'Software SaaS',
    startDate: '2025-02-01',
    endDate: '2028-02-01',
    totalDays: 1095,
    remainingDays: 1080,
    totalValue: 2400000,
    periodicity: 'plurianual',
    status: 'sem_assinatura',
    signatureStatus: 'Em Coleta de Rubricas',
    hasOcr: true,
    progressPercent: 5,
    isSigned: false,
    notes: '2 de 3 rubricas coletadas com sucesso.',
    signers: [],
    attachments: [],
    aiInsights: {
      executiveSummary: 'Acordo trienal com desconto negociado de 18% em relação à tabela pública.',
      items: []
    }
  },
  {
    id: 'ctr-014',
    code: 'CTR-2023-014',
    internalId: '#0014-23',
    title: 'Infraestrutura On-Premises Servidores Legados',
    supplierId: 'dell',
    supplierName: 'Dell Computadores do Brasil Ltda.',
    supplierCnpj: '72.381.189/0001-09',
    category: 'Leasing HW',
    startDate: '2023-01-01',
    endDate: '2024-12-31',
    totalDays: 730,
    remainingDays: 0,
    totalValue: 840000,
    periodicity: 'anual',
    status: 'expirado',
    signatureStatus: 'Instrumento Expirado',
    hasOcr: true,
    progressPercent: 100,
    isSigned: true,
    notes: 'Encerrado sem termo aditivo. Migração para cloud concluída.',
    signers: [],
    attachments: [],
    aiInsights: {
      executiveSummary: 'Contrato integralmente liquidado e desmobilizado com termo de encerramento assinado.',
      items: []
    }
  },
  {
    id: 'ctr-982',
    code: 'CTR-2025-0982',
    internalId: '#9820-25',
    title: 'Oracle Database Enterprise Edition SaaS',
    supplierId: 'oracle',
    supplierName: 'Oracle do Brasil Sistemas',
    supplierCnpj: '63.456.120/0001-90',
    category: 'Licenciamento SaaS',
    startDate: '2025-10-24',
    endDate: '2026-10-24',
    totalDays: 365,
    remainingDays: 365,
    totalValue: 840000,
    monthlyValue: 70000,
    periodicity: 'anual',
    status: 'vigente',
    signatureStatus: 'Assinado Digitalmente',
    hasOcr: true,
    progressPercent: 4,
    isSigned: true,
    signers: [],
    attachments: [],
    aiInsights: {
      executiveSummary: 'Cluster redundante com réplica geográfica e suporte Platinum 24/7.',
      items: []
    }
  },
  {
    id: 'ctr-411',
    code: 'CTR-2024-0411',
    internalId: '#0411-24',
    title: 'Vivo Links MPLS Dedicados & SD-WAN',
    supplierId: 'telefonica',
    supplierName: 'Vivo Telefônica Empresas',
    supplierCnpj: '02.558.157/0001-62',
    category: 'Telecomunicações',
    startDate: '2024-11-15',
    endDate: '2025-11-15',
    totalDays: 365,
    remainingDays: 22,
    totalValue: 96400,
    monthlyValue: 8033,
    periodicity: 'mensal',
    status: 'avencer',
    signatureStatus: 'Assinado Digitalmente',
    hasOcr: true,
    progressPercent: 94,
    riskCritical: true,
    isSigned: true,
    signers: [],
    attachments: [],
    aiInsights: {
      executiveSummary: 'Expira em 22 dias. Alerta automático enviado para a equipe de redes e TI.',
      items: []
    }
  },
  {
    id: 'ctr-188',
    code: 'CTR-2024-0188',
    internalId: '#0188-24',
    title: 'Gupy Recrutamento & Seleção com Inteligência Artificial',
    supplierId: 'gupy',
    supplierName: 'Gupy Tecnologia em Recrutamento',
    supplierCnpj: '23.514.660/0001-44',
    category: 'Plataforma RH',
    startDate: '2024-01-12',
    endDate: '2026-01-12',
    totalDays: 730,
    remainingDays: 80,
    totalValue: 78200,
    periodicity: 'anual',
    status: 'vigente',
    signatureStatus: 'Assinado Digitalmente',
    hasOcr: true,
    progressPercent: 89,
    isSigned: true,
    signers: [],
    attachments: [],
    aiInsights: {
      executiveSummary: 'Vigência regular com renovação automática permitida mediante prévio aviso de 30 dias.',
      items: []
    }
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Contrato AWS Brasil',
    description: 'Vence em 42 dias. Ação recomendada: Avaliar reajuste cambial e renovação de instâncias reservadas.',
    timeAgo: 'há 12m',
    type: 'expiracao',
    contractCode: 'CTR-2024-019',
    read: false,
    urgent: true,
    badgeText: '42 dias restantes',
    actionText: 'Ver contrato →'
  },
  {
    id: 'n2',
    title: 'Fornecedor TechData',
    description: 'Assinatura pendente do Diretor Financeiro (parado há 8 dias no estágio de alçada 2).',
    timeAgo: 'há 2h',
    type: 'assinatura',
    read: false,
    badgeText: 'Reenviar Cobrança',
    actionText: 'Cobrar'
  },
  {
    id: 'n3',
    title: 'Novo Fornecedor',
    description: 'Cadastrado pelo perfil Operacional aguardando homologação do Gestor (Omni Telecom Ltda).',
    timeAgo: 'ontem',
    type: 'fornecedor',
    read: false,
    badgeText: 'Revisar Cadastro',
    actionText: 'Homologar'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    user: 'Mariana Rios',
    action: 'cadastrou Minuta NDA',
    detail: 'CyberNet Brasil Soluções',
    timestamp: 'Hoje, 14:22',
    type: 'add'
  },
  {
    id: 'log-2',
    user: 'Dr. Felipe Prado',
    action: 'permissão atribuída',
    detail: 'Editor Jurídico atribuída ao perfil',
    timestamp: 'Hoje, 11:05',
    type: 'permission'
  },
  {
    id: 'log-3',
    user: 'Sistema Antifraude',
    action: 'Tentativa bloqueada',
    detail: 'Tentativa de alteração de minuta bloqueada (Hash Inválido #84B1)',
    timestamp: 'Ontem, 18:40',
    type: 'warning'
  }
];

export const INITIAL_SETTINGS: SystemSettings = {
  notice30Days: true,
  notice60Days: true,
  signaturePending7Days: true,
  aiRiskInstantAlert: true,
  legalEmail: 'juridico.corporativo@empresa.com.br',
  financeEmail: 'controladoria.contratos@empresa.com.br',
  smtpStatus: 'conectado',
  slackWebhookStatus: 'ativo',
  smsStatus: 'opcional',
  rbacMatrix: [
    {
      module: 'Cadastro de Fornecedores & Upload',
      subtext: 'Inserir dados básicos, certidões e minutas preliminares',
      admin: true,
      gestor: true,
      operacional: true
    },
    {
      module: 'Homologação e Validação Cadastral',
      subtext: 'Aprovação técnica de novos fornecedores e checagem fiscal',
      admin: true,
      gestor: true,
      operacional: false
    },
    {
      module: 'Aprovação de Alçadas & Parecer Jurídico',
      subtext: 'Assinatura formal de aditivos e liberação orçamentária',
      admin: true,
      gestor: true,
      operacional: false
    },
    {
      module: 'Relatórios Estratégicos & Exportação TCO',
      subtext: 'Acesso a volumetria, saving negociado e previsão de gastos',
      admin: true,
      gestor: true,
      operacional: 'leitura'
    },
    {
      module: 'Configurações Globais & Parâmetros de IA',
      subtext: 'Chaves de API, webhooks e redefinição de gatilhos',
      admin: true,
      gestor: false,
      operacional: false
    }
  ]
};

export const initialContracts = INITIAL_CONTRACTS;
export const initialSuppliers = INITIAL_SUPPLIERS;
export const initialSettings = INITIAL_SETTINGS;
export const initialNotifications = INITIAL_NOTIFICATIONS;
export const initialAuditLogs = INITIAL_AUDIT_LOGS;
