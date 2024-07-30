import { number } from 'yup';
import { array, object, string, mixed } from 'yup';

const dimensionFilters = object({
  dim_label: string().required('Label is required for the filter'),
  operator: string().required('Operator is required'),
  value: number().required('Value is required'),
});

const metricCriteria = object({
  metric: string().required(),
  aggregationType: string().required(),
  operator: string().required(),
  value: number().required(),
  filters: array().of(dimensionFilters).notRequired(),
});

const metricValidation = object().shape({
  metricCriteria: array()
    .of(metricCriteria)
    .min(1, 'At least one metric criteria is needed')
    .required(),
});

const triggerCondition = object({
  criteriaCondition: string().required(),
  evaluationInterval: string().required(),
  evaluationPeriod: string().required(),
  triggerOccurences: number().required(),
});

const content = object({
  email: string(),
});

const notifications = object({
  notification_type: string(),
  content,
});

export const createAlertDefinitionSchema = object({
  name: string().required('Label is required'),
  description: string(),
  tags: string(),
  region: string().required('Region is required'),
  serviceType: string().required('Service type is required'),
  resources: array().of(string()).required('Resources are required'),
  alertSeverity: string().required('Severity is required'),
  criteria: metricValidation,
  triggerCondition: array().of(triggerCondition),
  notifications: array().of(notifications),
});

const channelTypeSchema = (type: string) => {
  switch (type) {
    case 'Email':
      return object().shape({
        to: array().of(string().email('Invalid email address')).min(1, 'At least one recipient is required'),
      });
    default:
      return mixed();
  }
};

export const notificationChannelSchema = object({
  type: string().required('Type is required'),
  templateName: string().required('Template name is required'),
  values: mixed().when('type', (type, schema) => {
    if (type) {
      return channelTypeSchema(type);
    }
    return schema;
  }),
});