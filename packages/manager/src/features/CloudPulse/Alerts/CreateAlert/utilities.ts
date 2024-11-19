import { omitProps } from '@linode/ui';

import type {
  CreateAlertDefinitionForm,
  CreateAlertDefinitionPayload,
} from '@linode/api-v4';

export const getCreateAlertPayload = (
  formValues: CreateAlertDefinitionForm
): CreateAlertDefinitionPayload => {
  return omitProps(formValues, ['service_type', 'region', 'engine_type']);
};
