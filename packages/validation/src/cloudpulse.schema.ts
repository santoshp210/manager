import { array, object, string } from 'yup';

export const createAlertDefinitionSchema = object({
  name: string(),
  region: string(),
  serviceType: string(),
  resources: array(),
  alertSeverity: string(),
});
