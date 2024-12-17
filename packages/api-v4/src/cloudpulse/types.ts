export type NotificationStatus = 'Enabled' | 'Disabled';
export type ChannelTypes = 'email' | 'slack' | 'pagerduty' | 'webhook';
export type AlertNotificationType = 'default' | 'custom';
export type ALERT_DEFINTION_ENTITY = 'alerts-definitions';
export type AlertSeverityType = 0 | 1 | 2 | 3;
export type MetricAggregationType = 'avg' | 'sum' | 'min' | 'max' | 'count';
export type MetricOperatorType = 'eq' | 'gt' | 'lt' | 'gte' | 'lte';
export type AlertServiceType = 'linode' | 'dbaas';
type DimensionFilterOperatorType = 'eq' | 'neq' | 'startswith' | 'endswith';
export type AlertDefinitionType = 'system' | 'user';
export type AlertStatusType = 'enabled' | 'disabled';
export type CriteriaConditionType = 'ALL';
export type MetricUnitType =
  | 'number'
  | 'byte'
  | 'second'
  | 'percent'
  | 'bit_per_second'
  | 'millisecond'
  | 'KB'
  | 'MB'
  | 'GB';
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
  chart_type: 'line' | 'area';
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
  tags?: string[];
  description?: string;
  entity_ids?: string[];
  severity: AlertSeverityType;
  rule_criteria: {
    rules: MetricCriteria[];
  };
  trigger_conditions: TriggerCondition;
  channel_ids: number[];
}
export interface MetricCriteria {
  metric: string;
  aggregation_type: MetricAggregationType;
  operator: MetricOperatorType;
  threshold: number;
  dimension_filters?: DimensionFilter[];
}

export interface AlertDefinitionMetricCriteria extends MetricCriteria {
  unit: string;
  label: string;
}
export interface DimensionFilter {
  label: string;
  dimension_label: string;
  operator: DimensionFilterOperatorType;
  value: string;
}
export interface TriggerCondition {
  polling_interval_seconds: number;
  evaluation_period_seconds: number;
  trigger_occurrences: number;
  criteria_condition: CriteriaConditionType;
}
export interface Alert {
  id: number;
  label: string;
  tags: string[];
  description: string;
  status: AlertStatusType;
  type: AlertDefinitionType;
  severity: AlertSeverityType;
  service_type: AlertServiceType;
  rule_criteria: {
    rules: AlertDefinitionMetricCriteria[];
  };
  trigger_conditions: TriggerCondition;
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

interface NotificationChannelBase {
  id: number;
  label: string;
  channel_type: ChannelTypes;
  type: AlertNotificationType;
  status: NotificationStatus;
  alerts: {
    id: number;
    label: string;
    url: string;
    type: ALERT_DEFINTION_ENTITY;
  };
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

interface NotificationChannelEmail extends NotificationChannelBase {
  channel_type: 'email';
  content: {
    channel_type: {
      email_addresses: string[];
      subject: string;
      message: string;
    };
  };
}

interface NotificationChannelSlack extends NotificationChannelBase {
  channel_type: 'slack';
  content: {
    channel_type: {
      slack_webhook_url: string;
      slack_channel: string;
      message: string;
    };
  };
}

interface NotificationChannelPagerDuty extends NotificationChannelBase {
  channel_type: 'pagerduty';
  content: {
    channel_type: {
      service_api_key: string;
      attributes: string[];
      description: string;
    };
  };
}
interface NotificationChannelWebHook extends NotificationChannelBase {
  channel_type: 'webhook';
  content: {
    channel_type: {
      webhook_url: string;
      http_headers: {
        header_key: string;
        header_value: string;
      }[];
    };
  };
}
export type NotificationChannel =
  | NotificationChannelEmail
  | NotificationChannelSlack
  | NotificationChannelWebHook
  | NotificationChannelPagerDuty;
