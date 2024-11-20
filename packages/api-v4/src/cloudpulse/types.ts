export type NotificationStatus = 'Enabled' | 'Disabled';
export type ChannelTypes = 'email' | 'slack' | 'pagerduty' | 'webhook';
export type AlertNotificationType = 'default' | 'custom';
export type ALERT_DEFINTION_TYPE = 'alerts-definitions';
export type AlertSeverityType = 0 | 1 | 2 | 3 | null;
type MetricAggregationType = 'avg' | 'sum' | 'min' | 'max' | 'count' | null;
type MetricOperatorType = 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | null;
type DimensionFilterOperatorType =
  | 'eq'
  | 'neq'
  | 'startswith'
  | 'endswith'
  | null;
export type AlertStatusType = 'enabled' | 'disabled';
export interface Dashboard {
  id: number;
  label: string;
  widgets: Widgets[];
  created: string;
  updated: string;
  time_duration: TimeDuration;
  service_type: string;
}

export interface TimeGranularity {
  unit: string;
  value: number;
  label?: string;
}

export interface TimeDuration {
  unit: string;
  value: number;
}

export interface Widgets {
  label: string;
  metric: string;
  aggregate_function: string;
  group_by: string;
  region_id: number;
  namespace_id: number;
  color: string;
  size: number;
  chart_type: string;
  y_label: string;
  filters: Filters[];
  serviceType: string;
  service_type: string;
  resource_id: string[];
  time_granularity: TimeGranularity;
  time_duration: TimeDuration;
  unit: string;
}

export interface Filters {
  key: string;
  operator: string;
  value: string;
}

export type FilterValue =
  | number
  | string
  | string[]
  | number[]
  | WidgetFilterValue
  | undefined;

type WidgetFilterValue = { [key: string]: AclpWidget };

export interface AclpConfig {
  [key: string]: FilterValue;
  widgets?: WidgetFilterValue;
}

export interface AclpWidget {
  aggregateFunction: string;
  timeGranularity: TimeGranularity;
  label: string;
  size: number;
}

export interface MetricDefinitions {
  data: AvailableMetrics[];
}

export interface AvailableMetrics {
  label: string;
  metric: string;
  metric_type: string;
  unit: string;
  scrape_interval: string;
  available_aggregate_functions: string[];
  dimensions: Dimension[];
}

export interface Dimension {
  label: string;
  dimension_label: string;
  values: string[];
}

export interface JWETokenPayLoad {
  resource_ids: number[];
}

export interface JWEToken {
  token: string;
}

export interface CloudPulseMetricsRequest {
  metric: string;
  filters?: Filters[];
  aggregate_function: string;
  group_by: string;
  relative_time_duration: TimeDuration;
  time_granularity: TimeGranularity | undefined;
  resource_ids: number[];
}

export interface CloudPulseMetricsResponse {
  data: CloudPulseMetricsResponseData;
  isPartial: boolean;
  stats: {
    series_fetched: number;
  };
  status: string;
}

export interface CloudPulseMetricsResponseData {
  result: CloudPulseMetricsList[];
  result_type: string;
}

export interface CloudPulseMetricsList {
  metric: { [resourceName: string]: string };
  values: [number, string][];
}

export interface CreateAlertDefinitionPayload {
  label: string;
  description?: string;
  service_type: string;
  resource_ids: string[];
  severity: string;
  rule_criteria: {
    rules: MetricCriteria[];
  };
  triggerCondition: TriggerCondition;
  channel_ids: number[];
}
export interface MetricCriteria {
  metric: string;
  aggregation_type: string;
  operator: string;
  threshold: number;
  dimension_filters?: DimensionFilter[];
}

export interface DimensionFilter {
  dimension_label: string;
  operator: string;
  value: string;
}
export interface TriggerCondition {
  polling_interval_seconds: number;
  evaluation_period_seconds: number;
  trigger_occurrences: number;
}
export interface Alert {
  id: number;
  label: string;
  description: string;
  status: string;
  severity: string;
  service_type: string;
  resource_ids: string[];
  rule_criteria: {
    rules: MetricCriteria[];
  };
  triggerCondition: TriggerCondition;
  channels: {
    id: number;
    label: string;
    url: string;
    type: string;
  }[];
  created_by: string;
  updated_by: string;
  created: string;
  updated: string;
}

export interface ServiceTypes {
  service_type: string;
  label: string;
}

export interface ServiceTypesList {
  data: ServiceTypes[];
}