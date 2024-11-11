import Factory from 'src/factories/factoryProxy';
import { pickRandom } from 'src/utilities/random';

import type { Alert } from '@linode/api-v4';

const status = ['Enabled', 'Disabled'];

export const alertFactory = Factory.Sync.makeFactory<Alert>({
  channels: [],
  created: new Date().toISOString(),
  created_by: Factory.each(() => pickRandom(['user1', 'user2', 'user3'])),
  description: '',
  id: Factory.each(() => Math.floor(Math.random() * 1000000)),
  label: Factory.each((id) => `Alert-${id}`),
  resource_ids: ['1', '2', '3'],
  rule_criteria: {
    rules: [],
  },
  service_type: Factory.each(() => pickRandom(['linode', 'dbaas'])),
  severity: Factory.each(() => pickRandom(['0', '1', '2', '3'])),
  status: Factory.each(() => pickRandom(status)),
  triggerCondition: {
    evaluation_period_seconds: 0,
    polling_interval_seconds: 0,
    trigger_occurrences: 0,
  },
  updated: new Date().toISOString(),
  updated_by: Factory.each(() => pickRandom(['user1', 'user2', 'user3'])),
});
