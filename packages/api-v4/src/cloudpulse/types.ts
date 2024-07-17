export interface CreateAlertDefinitionPayload {
  type: string | null;
  alertName: string | null;
  region: string | null;
  description?: string | null;
  tags?: string[];
  serviceType: string | null;
  resourceId: string[];
  severity: string;
  criteria: MetricCriteria[];
  triggerCondition: {
    criteriaCondition: string;
    evaluationInterval: string;
    evaluationPeriod: string;
    triggerOccurrence: string;
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
  aggregationType: string;
  operator: string;
  value: number;
  filters: {
    dim_label: string;
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
  dimension_label: string;
  values: string[];
}
