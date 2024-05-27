import { object, string } from 'yup';

export const createAlertDefinitionSchema = object({
  name: string()
    .required('Name is required')
    .matches(/^[a-zA-Z0-0-]+$/, 'Alert Name cannot contain special characters')
    .min(8, 'Length must be between 8 and 20 characters.')
    .max(20, 'Length must be between 8 and 20 characters.'),
  region: string().required('Region is required'),
});

