import { waitForElementToBeRemoved } from '@testing-library/react';
import { rest } from 'msw';
import * as React from 'react';

import { namespaceFactory } from 'src/factories';
import { server } from 'src/mocks/testServer';
import { mockMatchMedia, renderWithTheme } from 'src/utilities/testHelpers';

import NamespaceDetail from './NamespaceDetail';

const loadingTestId = 'circle-progress';
beforeAll(() => mockMatchMedia());
describe('Namespace details', () => {
  it('should render the namespace details', async () => {
    const namespace = namespaceFactory.build({ id: 1 });

    server.use(
      rest.get('*/cloudview/namespaces/:id/key', (req, res, ctx) => {
        return res(
          ctx.json({
            active_keys: [
              {
                api_key: 'ACF2A5BzXPiYCNp6uUO5m8dYELTBXdio',
                expiry: '2024-04-12T16:08:55',
              },
            ],
          })
        );
      })
    );
    const { getByTestId, getByText } = renderWithTheme(
      <NamespaceDetail namespace={namespace} />
    );

    // expect(getByTestId(loadingTestId)).toBeInTheDocument();
    await waitForElementToBeRemoved(getByTestId(loadingTestId));
    getByText('API key:');
    // getByText()
    getByText('Cloud View Endpoint:');
    getByText(namespace.urls.ingest);
    getByText('Cloud View Read Endpoint:');
    getByText(namespace.urls.read);
  });
});
