import { fireEvent, screen, within } from '@testing-library/react';
import * as React from 'react';

import { renderWithThemeAndFormik } from 'src/utilities/testHelpers';

import { initialValues } from '../CreateAlertDefinition';
import { Metric } from './Metric';

import type { AvailableMetrics } from '@linode/api-v4';

const mockData: AvailableMetrics[] = [
  {
    available_aggregate_functions: ['min', 'max', 'avg'],
    dimensions: [
      {
        dim_label: 'cpu',
        dimension_label: 'cpu',
        label: 'CPU name',
        values: [],
      },
      {
        dim_label: 'state',
        dimension_label: 'state',
        label: 'State of CPU',
        values: [
          'user',
          'system',
          'idle',
          'interrupt',
          'nice',
          'softirq',
          'steal',
          'wait',
        ],
      },
      {
        dim_label: 'LINODE_ID',
        dimension_label: 'LINODE_ID',
        label: 'Linode ID',
        values: [],
      },
    ],
    label: 'CPU utilization',
    metric: 'system_cpu_utilization_percent',
    metric_type: 'gauge',
    scrape_interval: '2m',
    unit: 'percent',
  },
];

describe('Metric component tests', () => {
  it('should render all the components and names', () => {
    const container = renderWithThemeAndFormik(
      <Metric
        apiError={[true, true]}
        data={mockData}
        name={'criteria'}
        onMetricDelete={vi.fn()}
      />,
      { initialValues, onSubmit: vi.fn() }
    );
    expect(container.getByLabelText('Data Field')).toBeInTheDocument();
    expect(container.getByLabelText('Aggregation type')).toBeInTheDocument();
    expect(container.getByLabelText('Operator')).toBeInTheDocument();
    expect(container.getByLabelText('Value')).toBeInTheDocument();
  });
});
