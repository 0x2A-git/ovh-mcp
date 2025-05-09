import { z } from 'zod'
import { countryEnum } from './country.schema'
import { genderEnum } from './gender.schema'
import { languageEnum } from './language.schema'
import { legalFormEnum } from './legal-form.schema'
import { phoneTypeEnum } from './phone-type.schema'

export const contactSchema = z.object({
    address: z.string().nullable(),
    area: z.string().nullable(),
    birthCity: z.string().nullable(),
    birthDay: z.string().nullable(),
    city: z.string().nullable(),
    companyNationalIdentificationNumber: z.string().nullable(),
    complementaryAddress: z.string().nullable(),
    corporationType: z.string().nullable(),
    country: countryEnum,
    fax: z.string().nullable(),
    firstname: z.string().nullable(),
    italianSDI: z.string().nullable(),
    language: languageEnum.nullable(),
    legalform: legalFormEnum,
    name: z.string().nullable(),
    nationalIdentificationNumber: z.string().nullable(),
    organisation: z.string().nullable(),
    phone: z.string().nullable(),
    phoneCountry: countryEnum.nullable(),
    phoneType: phoneTypeEnum.nullable(),
    purposeOfPurchase: z.string().nullable(),
    sex: genderEnum.nullable(),
    spareEmail: z.string().nullable(),
    vat: z.string().nullable(),
    zip: z.string().nullable(),
})
