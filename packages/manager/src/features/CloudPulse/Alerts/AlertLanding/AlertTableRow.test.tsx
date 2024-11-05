import { screen } from '@testing-library/react';
import * as React from 'react';

import { alertFactory } from 'src/factories';
import { renderWithTheme, wrapWithTableBody } from 'src/utilities/testHelpers';

import { AlertTableRow } from './AlertTableRow';

describe('AlertRow', () => {
  it('should render an alert row', async () => {
    const alert = alertFactory.build();
    const renderedAlert = <AlertTableRow alert={alert} />;

    const { getByText } = renderWithTheme(wrapWithTableBody(renderedAlert));

    getByText(alert.name);
    getByText(alert.status);
    const statusElement = screen.getByText(alert.status);

    alert.status === 'Enabled' &&
      expect(statusElement).toHaveStyle(`color: rgb(50, 205, 50);`);
  });
});
