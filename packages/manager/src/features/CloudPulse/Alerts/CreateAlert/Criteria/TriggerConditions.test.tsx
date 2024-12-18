import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

import { renderWithThemeAndHookFormContext } from 'src/utilities/testHelpers';

import { TriggerConditions } from './TriggerConditions';

import type { CreateAlertDefinitionForm } from '../types';
import {
  EvaluationPeriodOptions,
  PollingIntervalOptions,
} from '../../constants';

const EvaluationPeriodTestId = 'Evaluation-period';

const PollingIntervalTestId = 'Polling-interval';
describe('Trigger Conditions', () => {
  const user = userEvent.setup();
  it('should render all the components and names', () => {
    const container = renderWithThemeAndHookFormContext({
      component: (
        <TriggerConditions
          maxScrapingInterval={0}
          name={'trigger_conditions'}
        />
      ),
    });
    expect(container.getByLabelText('Evaluation Period')).toBeInTheDocument();
    expect(container.getByLabelText('Polling Interval')).toBeInTheDocument();
    expect(
      container.getByText('criteria are met for at least')
    ).toBeInTheDocument();
    expect(container.getByText('consecutive occurences.')).toBeInTheDocument();
  });

  it('should show the options for the Autocomplete component', async () => {
    const container = renderWithThemeAndHookFormContext<CreateAlertDefinitionForm>(
      {
        component: (
          <TriggerConditions
            maxScrapingInterval={0}
            name={'trigger_conditions'}
          />
        ),
        useFormOptions: {
          defaultValues: {
            serviceType: 'linode',
          },
        },
      }
    );

    const evaluationPeriodContainer = container.getByTestId(
      EvaluationPeriodTestId
    );
    const evaluationPeriodInput = within(
      evaluationPeriodContainer
    ).getByRole('button', { name: 'Open' });
    await user.click(evaluationPeriodInput);
    expect(
      screen.getByRole('option', {
        name: EvaluationPeriodOptions.linode[2].label,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', {
        name: EvaluationPeriodOptions.linode[3].label,
      })
    ).toBeInTheDocument();

    const pollingIntervalContainer = container.getByTestId(
      PollingIntervalTestId
    );
    const pollingIntervalInput = within(
      pollingIntervalContainer
    ).getByRole('button', { name: 'Open' });
    await user.click(pollingIntervalInput);
    expect(
      screen.getByRole('option', {
        name: PollingIntervalOptions.linode[1].label,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', {
        name: PollingIntervalOptions.linode[2].label,
      })
    );
  });

  it('should render the tooltips for the Autocomplete components', () => {
    const container = renderWithThemeAndHookFormContext({
      component: (
        <TriggerConditions
          maxScrapingInterval={0}
          name={'trigger_conditions'}
        />
      ),
    });

    const evaluationPeriodContainer = container.getByTestId(
      EvaluationPeriodTestId
    );
    const evaluationPeriodToolTip = within(evaluationPeriodContainer).getByRole(
      'button',
      {
        name:
          'Defines the timeframe for collecting data in polling intervals to understand the service performance. Choose the data lookback period where the thresholds are applied to gather the information impactful for your business.',
      }
    );
    const pollingIntervalContainer = container.getByTestId(
      PollingIntervalTestId
    );
    const pollingIntervalToolTip = within(pollingIntervalContainer).getByRole(
      'button',
      {
        name: 'Choose how often you intend to evaulate the alert condition.',
      }
    );
    expect(evaluationPeriodToolTip).toBeInTheDocument();
    expect(pollingIntervalToolTip).toBeInTheDocument();
  });

  it('should be able to select the chosen option', async () => {
    const container = renderWithThemeAndHookFormContext<CreateAlertDefinitionForm>(
      {
        component: (
          <TriggerConditions
            maxScrapingInterval={0}
            name={'trigger_conditions'}
          />
        ),
        useFormOptions: {
          defaultValues: {
            serviceType: 'linode',
          },
        },
      }
    );
    const evaluationPeriodContainer = container.getByTestId(
      EvaluationPeriodTestId
    );
    const evaluationPeriodInput = within(
      evaluationPeriodContainer
    ).getByRole('button', { name: 'Open' });
    await user.click(evaluationPeriodInput);
    await user.click(
      screen.getByRole('option', {
        name: EvaluationPeriodOptions.linode[1].label,
      })
    );

    expect(
      within(evaluationPeriodContainer).getByRole('combobox')
    ).toHaveAttribute('value', EvaluationPeriodOptions.linode[1].label);

    const pollingIntervalContainer = container.getByTestId(
      PollingIntervalTestId
    );
    const pollingIntervalInput = within(
      pollingIntervalContainer
    ).getByRole('button', { name: 'Open' });
    await user.click(pollingIntervalInput);
    await user.click(
      screen.getByRole('option', {
        name: PollingIntervalOptions.linode[0].label,
      })
    );
    expect(
      within(pollingIntervalContainer).getByRole('combobox')
    ).toHaveAttribute('value', PollingIntervalOptions.linode[0].label);
  });

  it('should be able to show the options that are greater than or equal to max scraping Interval', () => {
    const container = renderWithThemeAndHookFormContext({
      component: (
        <TriggerConditions
          maxScrapingInterval={120}
          name={'trigger_conditions'}
        />
      ),
    });
    const evaluationPeriodContainer = container.getByTestId(
      EvaluationPeriodTestId
    );
    const evaluationPeriodInput = within(
      evaluationPeriodContainer
    ).getByRole('button', { name: 'Open' });
    user.click(evaluationPeriodInput);
    expect(
      screen.queryByText(EvaluationPeriodOptions.linode[0].label)
    ).not.toBeInTheDocument();

    const pollingIntervalContainer = container.getByTestId(
      PollingIntervalTestId
    );
    const pollingIntervalInput = within(
      pollingIntervalContainer
    ).getByRole('button', { name: 'Open' });
    user.click(pollingIntervalInput);
    expect(
      screen.queryByText(PollingIntervalOptions.linode[0].label)
    ).not.toBeInTheDocument();
  });
});
