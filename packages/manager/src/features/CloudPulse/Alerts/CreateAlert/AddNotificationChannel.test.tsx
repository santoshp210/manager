import * as React from 'react';

import { renderWithTheme } from 'src/utilities/testHelpers';
import { AddNotificationChannel } from './AddNotificationChannel';
import { fireEvent, waitFor } from '@testing-library/react';

describe('Custom Channel Autocomplete', () => {
  const mockOnCancel = vi.fn();
  const mockOnAddNotification = vi.fn();
  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
  ];
  it('should render the form with initial values', () => {
    const container = renderWithTheme(<AddNotificationChannel
      onCancel={mockOnCancel}
      onClickAddNotification={mockOnAddNotification}
      options={options}
    />)
    expect(container.getByLabelText('Type')).toBeInTheDocument();
    expect(container.getByLabelText('Channel')).toBeInTheDocument();
    expect(container.getByText('Cancel')).toBeInTheDocument();
    expect(container.getByText('Add channel')).toBeInTheDocument();
  });
  test('should validate form schema on submit', async () => {
    const container = renderWithTheme(<AddNotificationChannel
      onCancel={mockOnCancel}
      onClickAddNotification={mockOnAddNotification}
      options={options}
    />)

    fireEvent.click(container.getByText('Add channel'));
    expect(await container.findByText('Type is required')).toBeInTheDocument();
    //expect(await container.findByText('Template name is required')).toBeInTheDocument();
  });
  
  test('should handle type and template changes correctly', async () => {
    const container = renderWithTheme(<AddNotificationChannel
      onCancel={mockOnCancel}
      onClickAddNotification={mockOnAddNotification}
      options={options}
    />)

    const typeInput = container.getByLabelText('Type');
    fireEvent.change(typeInput, { target: { value: 'Email' } });
    fireEvent.focus(typeInput);
    fireEvent.click(container.getByText('Email'));

    expect(container.getByLabelText('Channel')).toBeInTheDocument();
    expect(typeInput).toHaveValue("Email");
    const channelInput = container.getByLabelText('Channel');
    
    fireEvent.change(channelInput, { target: { value: 'New Channel' } });
    fireEvent.focus(channelInput);
    fireEvent.click(container.getByText('New Channel'));
    await waitFor(() => {
      expect(container.getByPlaceholderText('Enter Email')).toBeInTheDocument();
    });
  });

  test('should handle email change', async () => {
    const container = renderWithTheme(<AddNotificationChannel
      onCancel={mockOnCancel}
      onClickAddNotification={mockOnAddNotification}
      options={options}
    />)

    const typeInput = container.getByLabelText('Type');
    fireEvent.mouseDown(typeInput);
    fireEvent.click(container.getByText('Email'));

    await waitFor(() => {
      expect(container.getByLabelText('Channel')).toBeInTheDocument();
    });

    const channelInput = container.getByLabelText('Channel');
    fireEvent.change(channelInput, { target: { value: 'New Channel' } });
    fireEvent.mouseDown(channelInput);
    fireEvent.click(container.getByText('New Channel'));

    await waitFor(() => {
      expect(container.getByPlaceholderText('Enter Email')).toBeInTheDocument();
    });

    const emailInput = container.getByPlaceholderText('Enter Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.keyDown(emailInput, { key: 'Enter' });

    await waitFor(() => {
      expect(container.getByText('test@example.com')).toBeInTheDocument();
    });
  });
});