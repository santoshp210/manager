import { number } from 'yup';
import { array, object, string, mixed } from 'yup';

const dimensionFilters = object({
  dim_label: string().required('Label is required for the filter'),
  operator: string().required('Operator is required'),
  value: number().required('Value is required'),
});

const metricCriteria = object({
  metric: string().required('Metric Data Field is required'),
  aggregationType: string().required('Aggregation type is required'),
  operator: string().required('Criteria Operator is required'),
  value: number().required('Threshold value is required'),
  filters: array().of(dimensionFilters).notRequired(),
});

const triggerCondition = object({
  criteriaCondition: string().required('Criteria condition is required'),
  pollingInterval: string().required('Polling Interval is required'),
  evaluationPeriod: string().required('Evaluation Period is required'),
  triggerOccurrence: number().required('Occurence is required'),
});

const content = object({
  email: string(),
});

const notifications = object({
  notification_type: string(),
  content,
});

const engionOptionValidation = object().when('serviceType', {
  is: 'dbaas',
  then: string().required(),
  otherwise: object().notRequired(),
});

export const createAlertDefinitionSchema = object({
  alertName: string().required('Name is required'),
  description: string(),
  region: string().required('Region is required'),
  serviceType: string().required('Service type is required'),
  // engionOption: engionOptionValidation,
  resourceId: array().of(string()).min(1, 'At least one resource is needed'),
  severity: string().required('Severity is required'),
  criteria: array()
    .of(metricCriteria)
    .min(1, 'At least one metric criteria is needed'),
  triggerCondition,
  notifications: array().of(notifications),
});

const channelTypeSchema = (type: string) => {
  switch (type) {
    case 'Email':
      return object().shape({
        to: array()
          .of(string().email('Invalid email address'))
          .min(1, 'At least one recipient is required'),
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
