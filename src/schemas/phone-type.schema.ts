import { z } from 'zod'

export const phoneTypeEnum = z.enum(['landline', 'mobile'])
