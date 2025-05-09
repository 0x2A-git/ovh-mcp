import { z } from 'zod'
import { countryEnum } from './country.schema'
import { genderEnum } from './gender.schema'
import { languageEnum } from './language.schema'
import { legalFormEnum } from './legal-form.schema'

export const ownerAddressSchema = z.object({
    birthCity: z.string().nullable(),
    birthCountry: countryEnum.nullable(),
    birthDay: z.string().nullable(),
    birthZip: z.string().nullable(),
})

export const ownerSchema = z.object({
    accreditationCountry: countryEnum.nullable(),
    accreditationId: z.string().nullable(),
    accreditationOrganism: z.string().nullable(),
    accreditationYear: z.number().nullable(),
    address: ownerAddressSchema.nullable(),
    birthCity: z.string().nullable(),
    birthCountry: countryEnum.nullable(),
    birthDay: z.string().nullable(),
    birthZip: z.string().nullable(),
    cellPhone: z.string().nullable(),
    companyNationalIdentificationNumber: z.string().nullable(),
    email: z.string().nullable(),
    enterpriseId: z.string().nullable(),
    fax: z.string().nullable(),
    firstName: z.string().nullable(),
    gender: genderEnum.nullable(),
    insee: z.string().nullable(),
    language: languageEnum.nullable(),
    lastName: z.string().nullable(),
    legalForm: legalFormEnum.nullable(),
    legalFormCategory: z.string().nullable(),
    nationalIdentificationNumber: z.string().nullable(),
    nationality: countryEnum.nullable(),
    organisationAccountable: z.string().nullable(),
    organisationFunding: z.string().nullable(),
    organisationFundingOther: z.string().nullable(),
    organisationName: z.string().nullable(),
    organisationRole: z.string().nullable(),
    organisationRoleOther: z.string().nullable(),
    organisationStaffStatus: z.string().nullable(),
    organisationStaffStatusOther: z.string().nullable(),
    organisationType: z.string().nullable(),
    organisationTypeOther: z.string().nullable(),
    phone: z.string().nullable(),
    registrantDocumentType: z.string().nullable(),
    registrantDocumentTypeOther: z.string().nullable(),
    roleInOrganisation: z.string().nullable(),
    trademarkId: z.string().nullable(),
    vat: z.string().nullable(),
    website: z.string().nullable(),
})
