import { QueryClient } from '@tanstack/react-query';
import { fireEvent, screen } from '@testing-library/react';
import * as React from 'react';

import { linodeFactory, loadbalancerFactory } from 'src/factories';
import { rest, server } from 'src/mocks/testServer';
import { mockMatchMedia, renderWithTheme } from 'src/utilities/testHelpers';

import { CloudViewMultiResourceSelect } from './ResourceMultiSelect';
// const queryClient = new QueryClient();
// beforeAll(() => mockMatchMedia());
// afterEach(() => queryClient.clear());

const queryMocks = vi.hoisted(() => ({
  useLinodeResourcesQuery: vi.fn().mockReturnValue({}),
  useLoadBalancerResourcesQuery: vi.fn().mockReturnValue({}),
}));

vi.mock('src/queries/cloudview/resources', async () => {
  const actual = await vi.importActual('src/queries/cloudview/resources');
  return {
    ...actual,
    useLinodeResourcesQuery: queryMocks.useLinodeResourcesQuery,
    useLoadBalancerResourcesQuery: queryMocks.useLoadBalancerResourcesQuery,
  };
});

const mockResourceHandler = vi.fn();
describe('ResourceMultiSelect component', () => {
  // it('should render disabled component if the the props are undefined or regions and service type does not have any resources', () => {
  //   const { getByPlaceholderText, getByTestId } = renderWithTheme(
  //     <CloudViewMultiResourceSelect
  //       disabled={false}
  //       handleResourceChange={mockResourceHandler}
  //       region={undefined}
  //       resourceType={undefined}
  //     />
  //   );
  //   // expect(resourceElement).toBeDisabled();
  //   expect(getByTestId('Resource-select')).toBeInTheDocument();
  //   expect(getByPlaceholderText('Select a resource')).toBeInTheDocument();
  // });

  // it('should render resources from the aclb', () => {

  //   queryMocks.useLoadBalancerResourcesQuery.mockReturnValue({
  //     data: loadbalancerFactory.buildList(5),
  //   });
  //   renderWithTheme(
  //     <CloudViewMultiResourceSelect
  //       disabled={false}
  //       handleResourceChange={mockResourceHandler}
  //       region={'us-west'}
  //       resourceType={'ACLB'}
  //     />
  //   );
  //   fireEvent.click(screen.getByRole('button', { name: 'Open' }));
  //   // screen.getByRole('option');
  //   const resourceElement = screen.getByRole('option', {
  //     name: 'aclb-1',
  //   });
  //   expect(resourceElement).toBeInTheDocument();
  // });

  it('should render resources from linode', async () => {
    queryMocks.useLinodeResourcesQuery.mockReturnValue({
      data: linodeFactory.buildList(5),
    });
    // server.use(
    //   rest.get('*/linode/instances/', (req, res, ctx) => {
    //     return res(ctx.json(linodeFactory.buildList(3)));
    //   })
    // );
    renderWithTheme(
      <CloudViewMultiResourceSelect
        disabled={false}
        handleResourceChange={mockResourceHandler}
        region={'us-east'}
        resourceType={'linodes'}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    const resourceElement = screen.getByRole('option', {
      name: 'linode-1',
    });
    expect(resourceElement).toBeInTheDocument();
  });
});
