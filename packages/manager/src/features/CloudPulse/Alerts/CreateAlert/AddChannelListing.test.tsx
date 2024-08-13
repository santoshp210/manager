import { fireEvent } from '@testing-library/react';
import * as React from 'react';

import { renderWithTheme } from 'src/utilities/testHelpers';

import { AddChannelListing } from './AddChannelListing';

describe('Add Channel Listing', () => {
  const notifications: any = [
    {
      templateName: 'testTemplate',
      type: 'Email',
      values: {
        to: ['test@example.com'],
      },
    },
  ];
  const mockOnChangeNotifications = vi.fn();
  const mockOnAddNotification = vi.fn();

  it('should render channels with the notification list', () => {
    const container = renderWithTheme(
      <AddChannelListing
        notifications={notifications}
        onChangeNotifications={mockOnChangeNotifications}
        onClickAddNotification={mockOnAddNotification}
      />
    );
    expect(container.getByText('testTemplate')).toBeInTheDocument();
    expect(container.getByText('Email')).toBeInTheDocument();
    expect(container.getByText('test@example.com')).toBeInTheDocument();
  });
  it('should call onChangeNotification method', () => {
    const container = renderWithTheme(
      <AddChannelListing
        notifications={notifications}
        onChangeNotifications={mockOnChangeNotifications}
        onClickAddNotification={mockOnAddNotification}
      />
    );
    const removeBtn = container.getByTestId('DeleteOutlineOutlinedIcon');
    fireEvent.click(removeBtn);
    expect(mockOnChangeNotifications).toHaveBeenCalledWith([]);
  });
});
