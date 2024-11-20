import { screen } from '@testing-library/react';
import * as React from 'react';

import { linodeFactory } from 'src/factories';
import { renderWithThemeAndHookFormContext } from 'src/utilities/testHelpers';

import { CloudPulseMultiResourceSelect } from './ResourceMultiSelect';
import userEvent from '@testing-library/user-event';

const queryMocks = vi.hoisted(() => ({
  useResourcesQuery: vi.fn().mockReturnValue({}),
}));

vi.mock('src/queries/cloudpulse/resources', async () => {
  const actual = await vi.importActual('src/queries/cloudpulse/resources');
  return {
    ...actual,
    useResourcesQuery: queryMocks.useResourcesQuery,
  };
});
const SELECT_ALL = 'Select All';
const ARIA_SELECTED = 'aria-selected';
describe('ResourceMultiSelect component tests', () => {
  it('should render disabled component if the props are undefined or regions and service type does not have any values', () => {
    queryMocks.useResourcesQuery.mockReturnValue({
      data: linodeFactory.buildList(2),
      isError: false,
      isLoading: false,
      status: 'success',
    });
    const {
      getByPlaceholderText,
      getByTestId,
    } = renderWithThemeAndHookFormContext({
      component: (
        <CloudPulseMultiResourceSelect
          engine="mysql"
          name="resource_ids"
          region={undefined}
          serviceType={null}
        />
      ),
    });
    expect(getByTestId('resource-select')).toBeInTheDocument();
    expect(getByPlaceholderText('Select Resources')).toBeInTheDocument();
  });
  it('should render resources happy path', async () => {
    queryMocks.useResourcesQuery.mockReturnValue({
      data: linodeFactory.buildList(2),
      isError: false,
      isLoading: false,
      status: 'success',
    });
    renderWithThemeAndHookFormContext({
      component: (
        <CloudPulseMultiResourceSelect
          engine="mysql"
          name="resource_ids"
          region="us-east"
          serviceType="linode"
        />
      ),
    });
    userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(
      await screen.findByRole('option', {
        name: 'linode-3',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', {
        name: 'linode-4',
      })
    ).toBeInTheDocument();
  });
  it('should be able to select all resources', async () => {
    queryMocks.useResourcesQuery.mockReturnValue({
      data: linodeFactory.buildList(2),
      isError: false,
      isLoading: false,
      status: 'success',
    });
    renderWithThemeAndHookFormContext({
      component: (
        <CloudPulseMultiResourceSelect
          engine="mysql"
          name="resource_ids"
          region="us-east"
          serviceType="linode"
        />
      ),
    });
    userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(
      await screen.findByRole('option', { name: SELECT_ALL })
    );
    expect(
      screen.getByRole('option', {
        name: 'linode-5',
      })
    ).toHaveAttribute(ARIA_SELECTED, 'true');
    expect(
      screen.getByRole('option', {
        name: 'linode-6',
      })
    ).toHaveAttribute(ARIA_SELECTED, 'true');
  });
  it('should be able to deselect the selected resources', async () => {
    queryMocks.useResourcesQuery.mockReturnValue({
      data: linodeFactory.buildList(2),
      isError: false,
      isLoading: false,
      status: 'success',
    });
    renderWithThemeAndHookFormContext({
      component: (
        <CloudPulseMultiResourceSelect
          engine="mysql"
          name="resource_ids"
          region="us-east"
          serviceType="linode"
        />
      ),
    });
    userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(
      await screen.findByRole('option', { name: SELECT_ALL })
    );
    userEvent.click(
      await screen.findByRole('option', { name: 'Deselect All' })
    );
    expect(
      screen.getByRole('option', {
        name: 'linode-7',
      })
    ).toHaveAttribute(ARIA_SELECTED, 'false');
    expect(
      screen.getByRole('option', {
        name: 'linode-8',
      })
    ).toHaveAttribute(ARIA_SELECTED, 'false');
  });

  it('should select multiple resources', async () => {
    queryMocks.useResourcesQuery.mockReturnValue({
      data: linodeFactory.buildList(3),
      isError: false,
      isLoading: false,
      status: 'success',
    });
    renderWithThemeAndHookFormContext({
      component: (
        <CloudPulseMultiResourceSelect
          engine="mysql"
          name="resource_ids"
          region="us-east"
          serviceType="linode"
        />
      ),
    });
    userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(
      await screen.findByRole('option', { name: 'linode-9' })
    );
    await userEvent.click(
      await screen.findByRole('option', { name: 'linode-10' })
    );

    expect(
      screen.getByRole('option', {
        name: 'linode-9',
      })
    ).toHaveAttribute(ARIA_SELECTED, 'true');
    expect(
      screen.getByRole('option', {
        name: 'linode-10',
      })
    ).toHaveAttribute(ARIA_SELECTED, 'true');
    expect(
      screen.getByRole('option', {
        name: 'linode-11',
      })
    ).toHaveAttribute(ARIA_SELECTED, 'false');
    expect(
      screen.getByRole('option', {
        name: 'Select All',
      })
    ).toHaveAttribute(ARIA_SELECTED, 'false');
  });
  it('should render the label as cluster when resource is of dbaas type', () => {
    const { getByLabelText } = renderWithThemeAndHookFormContext({
      component: (
        <CloudPulseMultiResourceSelect
          engine="mysql"
          name="resource_ids"
          region="us-east"
          serviceType="dbaas"
        />
      ),
    });
    expect(getByLabelText('Cluster'));
  });
});
