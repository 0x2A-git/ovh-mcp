import { z } from 'zod'

export const legalFormEnum = z.enum([
    'administration',
    'association',
    'corporation',
    'individual',
    'other',
    'personalcorporation',
])
