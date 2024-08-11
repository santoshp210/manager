import { fireEvent, within, screen } from '@testing-library/react';
import * as React from 'react';

import { renderWithThemeAndFormik } from 'src/utilities/testHelpers';

import { initialValues } from '../CreateAlertDefinition';
import { TriggerConditions } from './TriggerConditions';

describe('Trigger Conditions', () => {
  it('should render all the components and names', () => {
    const container = renderWithThemeAndFormik(
      <TriggerConditions maxScrapingInterval={0} name={'triggercondition'} />,
      { initialValues, onSubmit: vi.fn() }
    );
    expect(container.getByLabelText('Evaluation period')).toBeInTheDocument();
    expect(container.getByLabelText('Polling interval')).toBeInTheDocument();
    expect(container.getByLabelText('Trigger alert when')).toBeInTheDocument();
    expect(
      container.getByText('criteria are met for at least')
    ).toBeInTheDocument();
    expect(container.getByText('occurences.')).toBeInTheDocument();
  });

  it('should show the options for the Autocomplete component', () => {
    const container = renderWithThemeAndFormik(
      <TriggerConditions maxScrapingInterval={0} name={'triggercondition'} />,
      { initialValues, onSubmit: vi.fn() }
    );

    const evaluationPeriodContainer = container.getByTestId(
      'Evaluation-period'
    );
    const evaluationPeriodInput = within(
      evaluationPeriodContainer
    ).getByRole('button', { name: 'Open' });
    fireEvent.click(evaluationPeriodInput);
    expect(
      screen.getByRole('option', {
        name: '30m',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', {
        name: '1hr',
      })
    );

    const pollingIntervalContainer = container.getByTestId('Polling-interval');
    const pollingIntervalInput = within(
      pollingIntervalContainer
    ).getByRole('button', { name: 'Open' });
    fireEvent.click(pollingIntervalInput);
    expect(
      screen.getByRole('option', {
        name: '5m',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', {
        name: '10m',
      })
    );

    const triggerAlertconditionContainer = container.getByTestId(
      'Trigger-alert-condition'
    );
    const triggerAlertConditionInput = within(
      triggerAlertconditionContainer
    ).getByRole('button', { name: 'Open' });
    fireEvent.click(triggerAlertConditionInput);
    expect(
      screen.getByRole('option', {
        name: 'AND',
      })
    );
  });

  it('should render the tooltips for the Autocomplete components', () => {
    const container = renderWithThemeAndFormik(
      <TriggerConditions maxScrapingInterval={0} name={'triggercondition'} />,
      { initialValues, onSubmit: vi.fn() }
    );

    const evaluationPeriodContainer = container.getByTestId(
      'Evaluation-period'
    );
    const evaluationPeriodInput = within(
      evaluationPeriodContainer
    ).getByRole('button', { name: 'Open' });
    fireEvent.click(evaluationPeriodInput);
  });
});
