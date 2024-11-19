import { fireEvent, screen } from '@testing-library/react';
import * as React from 'react';

import { renderWithThemeAndHookFormContext } from 'src/utilities/testHelpers';

import { EngineOption } from './EngineOption';

describe('EngineOption component tests', () => {
  it('should render the component when resource type is dbaas', () => {
    const { getByLabelText, getByTestId } = renderWithThemeAndHookFormContext({
      component: <EngineOption name={'engine_type'} />,
    });
    expect(getByLabelText('Engine Option')).toBeInTheDocument();
    expect(getByTestId('engine-option')).toBeInTheDocument();
  });
  it('should render the options happy path', () => {
    renderWithThemeAndHookFormContext({
      component: <EngineOption name={'engine_type'} />,
    });
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('option', { name: 'MySQL' }));
    expect(screen.getByRole('option', { name: 'PostgreSQL' }));
  });
  it('should be able to select an option', () => {
    renderWithThemeAndHookFormContext({
      component: <EngineOption name={'engine_type'} />,
    });
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    fireEvent.click(screen.getByRole('option', { name: 'MySQL' }));
    expect(screen.getByRole('combobox')).toHaveAttribute('value', 'MySQL');
  });
});