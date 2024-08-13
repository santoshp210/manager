import * as React from 'react';

import { renderWithTheme } from 'src/utilities/testHelpers';

import { CustomChannelAutocomplete } from './CustomChannelAutocomplete';
import { fireEvent } from '@testing-library/react';

describe('Custom Channel Autocomplete', () => {
  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
  ];
  const mockOnChange = vi.fn();

  it('should initially render custom channel component', () => {
    const { getByText } = renderWithTheme(
      <CustomChannelAutocomplete
        handleBlur={vi.fn()}
        options={options}
        value=""
        label="custom autocomplete"
        onChange={mockOnChange}
      />
    );
    expect(getByText('custom autocomplete')).toBeInTheDocument();
  });
  it('should call handleChange with selected value', () => {
    const mockOnChange = vi.fn();
    const container = renderWithTheme(
      <CustomChannelAutocomplete
        handleBlur={vi.fn()}
        options={options}
        value=""
        label="custom autocomplete"
        onChange={mockOnChange}
      />
    );
    const input = container.getByLabelText('custom autocomplete');
    fireEvent.change(input, { target: { value: 'Option 1' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockOnChange).toHaveBeenCalledWith('Option 1');
  });
  it('should allow creating new option in freeSolo mode', () => {
    const container = renderWithTheme(
      <CustomChannelAutocomplete
        handleBlur={vi.fn()}
        options={options}
        value=""
        label="custom autocomplete"
        onChange={mockOnChange}
      />
    );
    const input = container.getByLabelText('custom autocomplete');
    fireEvent.change(input, { target: { value: 'New Option' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockOnChange).toHaveBeenCalledWith('New Option');
  });
  it('should clear selection when input is cleared', () => {
    const container = renderWithTheme(
      <CustomChannelAutocomplete
        handleBlur={vi.fn()}
        options={options}
        value="option1"
        label="custom autocomplete"
        onChange={mockOnChange}
      />
    );
    const clearBtn = container.getByTitle('Clear');
    fireEvent.click(clearBtn);
    expect(mockOnChange).toHaveBeenCalledWith('');
  });
});
