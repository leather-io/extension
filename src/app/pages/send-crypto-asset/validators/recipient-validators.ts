import * as yup from 'yup';

export const stxAddressValidator = yup.string().defined();

export const btcAddressValidator = yup.string().defined();
