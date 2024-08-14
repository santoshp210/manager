import { number } from 'yup';
import { array, object, string, mixed } from 'yup';

const dimensionFilters = object({
  dimension_label: string().required('Label is required for the filter'),
  operator: string().required('Operator is required'),
  value: string().required('Value is required'),
});

const metricCriteria = object({
  metric: string().required('Metric Data Field is required'),
  aggregation_type: string().required('Aggregation type is required'),
  operator: string().required('Criteria Operator is required'),
  value: number().required('Threshold value is required'),
  dimension_filters: array().of(dimensionFilters).notRequired(),
});

const triggerCondition = object({
  criteria_condition: string().required('Criteria condition is required'),
  polling_interval_seconds: string().required('Polling Interval is required'),
  evaluation_period_seconds: string().required('Evaluation Period is required'),
  trigger_occurrences: number().required('Occurence is required'),
});

const engineOptionValidation = string().when('serviceType', {
  is: 'dbaas',
  then: string().required(),
  otherwise: string().notRequired(),
});

export const createAlertDefinitionSchema = object({
  name: string().required('Name is required'),
  description: string(),
  region: string().required('Region is required'),
  service_type: string().required('Service type is required'),
  engineOption: engineOptionValidation,
  resource_ids: array().of(string()).min(1, 'At least one resource is needed'),
  severity: string().required('Severity is required'),
  criteria: array()
    .of(metricCriteria)
    .min(1, 'At least one metric criteria is needed'),
  triggerCondition,
  notifications: array()
    .of(string())
    .min(1, 'At least one notification channel is needed'),
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
