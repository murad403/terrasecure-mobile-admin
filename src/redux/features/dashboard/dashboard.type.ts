export interface DashboardMeta {
  generatedAt: string;
  timeRange: string;
  compareRange: string;
  timezone: string;
  currency: string;
  cacheTtlSeconds: number;
  dataFreshnessSeconds: number;
}

export interface AttentionItem {
  id: string;
  severity: "critical" | "warning" | "info" | string;
  category: string;
  title: string;
  detail: string;
  count: number;
  actionLabel?: string;
  actionHref?: string;
  firstItemHref?: string;
  detectedAt: string;
}

export interface AttentionSummary {
  critical: number;
  warning: number;
  info: number;
  total: number;
}

export interface AttentionData {
  summary: AttentionSummary;
  items: AttentionItem[];
}

export interface FunnelStep {
  key: string;
  label: string;
  value: number;
  conversionFromPrev: number | null;
  dropOffPct: number | null;
}

export interface FunnelDetail {
  label: string;
  steps: FunnelStep[];
  biggestDropOff: {
    step: string;
    dropOffPct: number;
  } | null;
}

export interface FunnelData {
  registration: FunnelDetail;
  purchaseInterest: FunnelDetail;
}

export interface SlaItem {
  target_hours: number;
  avg_hours: number | null;
  p50_hours?: number | null;
  p90_hours?: number | null;
  breached: number;
  at_risk: number;
  on_track: number;
  sla_compliance_pct: number | null;
}

export interface SlaData {
  registrations: SlaItem;
  investigations: SlaItem;
  land_requests: SlaItem;
  site_visits: SlaItem;
}

export interface KpiMetric {
  value: number;
  previousValue?: number;
  deltaPct?: number | null;
  trend?: string;
  unit?: string;
  note?: string;
}

export interface KpiMoneyMetric {
  amount: string;
  currency: string;
  previousValue?: string;
  deltaPct?: number | null;
  count?: number;
}

export interface DashboardKpis {
  users: {
    total: KpiMetric;
    new: KpiMetric;
    dau: { value: number };
    wau: { value: number };
    onlineNow: { value: number };
    retention_d7: KpiMetric;
    retention_d30: KpiMetric;
    churnRisk: KpiMetric;
  };
  parcels: {
    total: KpiMetric;
    activeListings: { value: number };
    listedForSale: { value: number };
    totalAreaHa: KpiMetric;
    medianPricePerSqm: KpiMoneyMetric;
    avgReliability: KpiMetric;
  };
  money: {
    totalWalletBalance: KpiMoneyMetric;
    gmv_7d: KpiMoneyMetric;
    revenue_7d: KpiMoneyMetric;
    credit_24h: KpiMoneyMetric;
    debit_24h: KpiMoneyMetric;
    pendingPayouts: KpiMoneyMetric;
    failedTxn_24h: KpiMetric;
  };
  messaging: {
    conversations: KpiMetric;
    messages: KpiMetric;
    unread: { value: number };
    supportOpenTickets: { value: number };
  };
  quality: {
    disputeRate: KpiMetric;
    avgRating: KpiMetric;
    flaggedUsers: { value: number };
    rejectedDocs: { value: number };
  };
}

export interface TrendNewUser {
  t: string;
  value: number;
  comparedTo: number;
}

export interface TrendRegistration {
  t: string;
  submitted: number;
  approved: number;
  rejected: number;
  inReview: number;
}

export interface TrendMessage {
  t: string;
  value: number;
}

export interface TrendWalletFlow {
  t: string;
  credit: number;
  debit: number;
  net: number;
}

export interface TrendConflict {
  t: string;
  detected: number;
  resolved: number;
  openEnding: number;
}

export interface DashboardTrends {
  period: string;
  granularity: string;
  series: {
    newUsers: TrendNewUser[];
    registrations: TrendRegistration[];
    messages: TrendMessage[];
    walletFlow: TrendWalletFlow[];
    conflicts: TrendConflict[];
  };
  anomalies: any[];
}

export interface BreakdownKeyValue {
  key: string;
  value: number;
}

export interface BreakdownVerification {
  key: string;
  verified: number;
  pending: number;
}

export interface BreakdownRegion {
  key: string;
  value: number;
  avgReliability: number;
}

export interface DashboardBreakdowns {
  usersByStatus: BreakdownKeyValue[];
  usersByRole: BreakdownKeyValue[];
  usersByVerification: BreakdownVerification[];
  parcelsByStatus: BreakdownKeyValue[];
  parcelsByAreaBucket: BreakdownKeyValue[];
  parcelsByRegion: BreakdownRegion[];
  requestsByKind: BreakdownKeyValue[];
  requestsByStatus: BreakdownKeyValue[];
  investigationsByPriority: BreakdownKeyValue[];
  conflictsByKind: BreakdownKeyValue[];
  conversationsByType: BreakdownKeyValue[];
  messagesByType: BreakdownKeyValue[];
  topSurveyors: any[];
  topReviewers: any[];
}

export interface UnassignedInvestigationItem {
  id: number;
  slug: string;
  kind: string;
  priorityLevel: string;
  parcelCode: string;
  createdAt: string;
  ageDays: number;
}

export interface PendingSiteVisitItem {
  id: number;
  slug: string;
  parcelCode: string | null;
  scheduledAt: string;
  surveyorName: string;
  status: string;
  phone: string;
}

export interface PendingPurchaseInterestItem {
  id: number;
  slug: string;
  buyerName: string;
  parcelCode: string;
  askPricePerSqm: number | null;
  offerAmount: KpiMoneyMetric;
  createdAt: string;
}

export interface UnverifiedDocumentItem {
  id: string;
  parcelCode: string | null;
  docType: string;
  version: number;
  createdAt: string;
  uploadedBy: string;
}

export interface DashboardQueues {
  pendingRegistrations: { count: number; oldest: string | null; slaBreached: number; items: any[] };
  openConflicts: { count: number; autoDetectedPct: number; items: any[] };
  unassignedInvestigations: { count: number; criticalCount: number; items: UnassignedInvestigationItem[] };
  pendingSiteVisits: { count: number; todayCount: number; items: PendingSiteVisitItem[] };
  pendingLandRequests: { count: number; breachedSLA: number; items: any[] };
  pendingPurchaseInterests: { count: number; avgOfferVsAskPct: number | null; items: PendingPurchaseInterestItem[] };
  pendingContactRequests: { count: number; items: any[] };
  unverifiedDocuments: { count: number; items: UnverifiedDocumentItem[] };
  lockedAccounts: { count: number; items: any[] };
  pendingPayouts: { count: number; totalAmount: KpiMoneyMetric; items: any[] };
}

export interface ActivityItem {
  id: string;
  kind: string;
  action: string;
  actor: {
    id: number;
    name: string;
    avatarUrl: string | null;
  };
  target: {
    type: string;
    id: string;
    label: string | null;
    href: string | null;
  };
  timestamp: string;
  severity: string;
}

export interface TeamWorkload {
  userId: number;
  name: string;
  openRegistrations: number;
  openConflicts: number;
  openInvestigations: number;
}

export interface DashboardTeam {
  onlineAdmins: any[];
  workload: TeamWorkload[];
}

export interface DashboardFilters {
  timeRange: string[];
  roles: string[];
  userStatuses: string[];
  parcelStatuses: string[];
  registrationStatuses: string[];
  requestKinds: string[];
  requestStatuses: string[];
  conflictKinds: string[];
  investigationPriorities: string[];
  documentTypes: string[];
  currencies: string[];
  severities: string[];
  permissions: string[];
}

export interface DashboardOverviewData {
  meta: DashboardMeta;
  attention: AttentionData;
  funnel: FunnelData;
  sla: SlaData;
  kpis: DashboardKpis;
  funnelsAndCohorts?: any;
  trends: DashboardTrends;
  breakdowns: DashboardBreakdowns;
  queues: DashboardQueues;
  activity: {
    items: ActivityItem[];
    groupedByKind: Record<string, any>;
  };
  team: DashboardTeam;
  filters: DashboardFilters;
}
