import { omitProps } from '@linode/ui';

import type { CreateAlertDefinitionForm, MetricCriteriaForm } from './types';
import type {
  CreateAlertDefinitionPayload,
  MetricCriteria,
} from '@linode/api-v4';

// filtering out the form properties which are not part of the payload
export const filterFormValues = (
  formValues: CreateAlertDefinitionForm
): CreateAlertDefinitionPayload => {
  const values = omitProps(formValues, [
    'serviceType',
    'region',
    'engineType',
    'severity',
    'rule_criteria',
  ]);
  // severity has a need for null in the form for edge-cases, so null-checking and returning it as an appropriate type
  const severity = formValues.severity!;
  const entityIds = formValues.entity_ids;
  const rules = formValues.rule_criteria.rules;
  return {
    ...values,
    entity_ids: entityIds,
    rule_criteria: { rules: filterMetricCriteriaFormValues(rules) },
    severity,
  };
};

export const filterMetricCriteriaFormValues = (
  formValues: MetricCriteriaForm[]
): MetricCriteria[] => {
  return formValues.map((rule) => {
    const values = omitProps(rule, ['aggregation_type', 'operator', 'metric']);
    return {
      ...values,
      aggregation_type: rule.aggregation_type!,
      dimension_filters: rule.dimension_filters,
      metric: rule.metric!,
      operator: rule.operator!,
    };
  });
};
