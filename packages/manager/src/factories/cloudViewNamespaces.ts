import { Namespace, NamespaceApiKey } from '@linode/api-v4/lib/cloudview/types';
import * as Factory from 'factory.ts';

import { pickRandom } from 'src/utilities/random';

const timestamps = [
  '2023-07-12T16:08:53',
  '2023-07-12T04:30:53',
  '2023-09-15T10:42:53',
  '2023-09-15T00:00:00',
];

const regions = ['us-east', 'us-west', 'jp-osa', 'ap-west'];
export const namespaceFactory = Factory.Sync.makeFactory<Namespace>({
  // created: '2023-07-12T16:08:53',
  created: Factory.each(() => pickRandom(timestamps)),
  id: Factory.each((i) => i),
  label: Factory.each((i) => `cloudview-${i}`),
  region: Factory.each(() => pickRandom(regions)),
  type: 'metric',
  // eslint-disable-next-line perfectionist/sort-objects
  updated: '2023-07-12T16:08:55',
  urls: {
    ingest: 'https://cloudviewtestingest.com',
    read: 'https://cloudviewtestread.com',
    // eslint-disable-next-line perfectionist/sort-objects
    agent_install: 'https://cloudviewtestinstall.com',
  },
});
