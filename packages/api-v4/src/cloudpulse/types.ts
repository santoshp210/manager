export interface CreateAlertDefinitionPayload {
  name: string | null;
  region: string | null;
  description?: string | null;
  tags?: string[];
  service_type: string;
  resources: string[];
  alertSeverity: string;
}

export interface Alert {
  name: string | null;
  region: string | null;
}
