import { z } from 'zod'
import { domainPurposeEnum } from './domain-purpose.schema'

export const domainSchema = z.object({
    audience: z.string().nullable(),
    authInfo: z.string().nullable(),
    isFor: z.array(domainPurposeEnum),
    otherPurpose: z.string().nullable(),
    reason: z.string().nullable(),
    represent: z.string().nullable(),
})
