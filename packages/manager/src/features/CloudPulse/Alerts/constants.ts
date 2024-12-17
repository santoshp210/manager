import type {
  AlertSeverityType,
  DimensionFilterOperatorType,
  MetricOperatorType,
  MetricAggregationType
} from '@linode/api-v4';

export interface Item<L extends string, T> {
  label: L;
  value: T;
}
export const alertSeverityOptions: Item<string, AlertSeverityType>[] = [
  { label: 'Info', value: 3 },
  { label: 'Low', value: 2 },
  { label: 'Medium', value: 1 },
  { label: 'Severe', value: 0 },
];

export const engineTypeOptions: Item<string, string>[] = [
  {
    label: 'MySQL',
    value: 'mysql',
  },
  {
    label: 'PostgreSQL',
    value: 'postgresql',
  },
];

export const MetricAggregationOptions: Item<string, MetricAggregationType>[] = [
  {
    label: 'Average',
    value: 'avg',
  },
  {
    label: 'Minimum',
    value: 'min',
  },
  {
    label: 'Maximum',
    value: 'max',
  },
  {
    label: 'Count',
    value: 'count',
  },
  {
    label: 'Sum',
    value: 'sum',
  },
];

export const DimensionOperatorOptions: Item<
  string,
  DimensionFilterOperatorType
>[] = [
  {
    label: 'Equal',
    value: 'eq',
  },
  {
    label: 'Ends with',
    value: 'endswith',
  },
  {
    label: 'Not Equal',
    value: 'neq',
  },
  {
    label: 'Starts with',
    value: 'startswith',
  },
];

export const MetricOperatorOptions: Item<string, MetricOperatorType>[] = [
  {
    label: '>',
    value: 'gt',
  },
  {
    label: '<',
    value: 'lt',
  },
  {
    label: '>=',
    value: 'gte',
  },
  {
    label: '<=',
    value: 'lte',
  },
  {
    label: '==',
    value: 'eq',
  },
];
export const EvaluationPeriodOptions = [
  { label: '1m', value: '60' },
  { label: '5m', value: '300' },
  { label: '15m', value: '900' },
  { label: '30m', value: '1800' },
  { label: '1hr', value: '3600' },
];

export const PollingIntervalOptions = [
  {
    label: '1m',
    value: '60',
  },
  {
    label: '5m',
    value: '300',
  },
  {
    label: '10m',
    value: '600',
  },
];

export const convertSeconds = (secondsList: string[]) => {
  return secondsList.map((second) => {
    const unit = second.slice(-1)[0];
    const number = parseInt(second.slice(0, -1), 10);
    switch (unit) {
      case 's':
        return number;
      case 'm':
        return number * 60;
      case 'h':
        return number * 3600;
      default:
        return number * 0;
    }
  });
};

export const ChannelTypeOptions = [
  {
    label: 'Email',
    value: 'email',
  },
];
