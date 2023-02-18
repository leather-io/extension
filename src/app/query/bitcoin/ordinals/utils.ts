import * as yup from 'yup';

/**
 * Schema of data used from the `GET https://ordapi.xyz/address/:address` endpoint. Additional data
 * that is not currently used by the app may be returned by this endpoint.
 *
 * See API docs, https://ordapi.xyz/
 */
export const ordApiXyzGetInscriptionByAddressSchema = yup
  .array(
    yup.object({
      // NOTE: this next key is using a space " ", uncommon as that is.
      ['content type']: yup.string().required(),

      content: yup.string().required(),
      preview: yup.string().required(),
      title: yup.string().required(),
    })
  )
  .required();
