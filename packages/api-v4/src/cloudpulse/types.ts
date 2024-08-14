export interface CreateAlertDefinitionPayload {
  name: string | null;
  region: string | null;
  description?: string | null;
  service_type: string | null;
  engineOption: string | null;
  resource_ids: string[];
  severity: string;
  criteria: MetricCriteria[];
  triggerCondition: {
    criteria_condition: string;
    polling_interval_seconds: string;
    evaluation_period_seconds: string;
    trigger_occurrences: number;
  };
  notifications: {
    notification_type: string;
    content: {
      email: string;
    };
  }[];
}
export interface MetricCriteria {
  metric: string;
  aggregation_type: string;
  operator: string;
  value: number;
  dimension_filters: {
    dimension_label: string;
    operator: string;
    value: string;
  }[];
}
export interface Alert {
  name: string | null;
  region: string | null;
}

export interface ServiceTypes {
  data: Services[];
}

export interface Services {
  service_type: string;
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
  available_aggregate_functions: Array<string>;
  dimensions: Dimension[];
}

export interface Dimension {
  label: string;
  dim_label: string;
  values: string[];
}
