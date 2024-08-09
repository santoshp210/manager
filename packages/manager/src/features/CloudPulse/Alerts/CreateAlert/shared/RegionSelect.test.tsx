import { Region } from '@linode/api-v4';
import * as React from 'react';

import * as regions from 'src/queries/regions/regions';
import { renderWithThemeAndFormik } from 'src/utilities/testHelpers';

import { CloudPulseRegionSelect } from './RegionSelect';
import { initialValues } from '../CreateAlertDefinition';

// vi.mock('formik', () => ({
//   useFormikContext: vi.fn().mockReturnValue({
//     setFieldValue: vi.fn(),
//     getFieldProps: vi.fn(),
//   }),
// }));
describe('RegionSelect', () => {
  vi.spyOn(regions, 'useRegionsQuery').mockReturnValue({
    data: Array<Region>(),
  } as ReturnType<typeof regions.useRegionsQuery>);

  it('should render a RegionSelect component', () => {
    const { getByTestId } = renderWithThemeAndFormik(
      <CloudPulseRegionSelect handleRegionChange={vi.fn()} name={'region'} />,
      { initialValues, onSubmit: vi.fn() }
    );
    expect(getByTestId('region-select')).toBeInTheDocument();
  });
});
