import { fireEvent, screen } from '@testing-library/react';
import * as React from 'react';

import { renderWithTheme } from 'src/utilities/testHelpers';

import {
  CloudViewIntervalSelect,
  CloudViewIntervalSelectProps,
} from './IntervalSelect';

const handleIntervalChange = vi.fn();
describe('IntervalSelect', () => {
  const props: CloudViewIntervalSelectProps = {
    handleIntervalChange,
  };

  it('should render a Select component with the correct label', () => {
    const { getByTestId } = renderWithTheme(
      <CloudViewIntervalSelect {...props} />
    );
    expect(getByTestId('interval-select')).toBeInTheDocument();
  });

  it('calls the handleIntervalChange when an option is selected', () => {
    renderWithTheme(<CloudViewIntervalSelect {...props} />);

    const inputElement = screen.getByRole('combobox');
    fireEvent.focus(inputElement);
    fireEvent.change(inputElement, {
      target: { value: '1 day' },
    });

    const optionElement = screen.getByText('1 day');
    fireEvent.click(optionElement);

    const selectOption = handleIntervalChange.mock.calls[2][0];
    expect(selectOption).toEqual('1d');
  });
});
