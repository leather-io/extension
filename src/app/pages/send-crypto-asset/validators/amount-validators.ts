import * as yup from 'yup';

export const amountFieldValidator = yup.number().required().moreThan(0);
