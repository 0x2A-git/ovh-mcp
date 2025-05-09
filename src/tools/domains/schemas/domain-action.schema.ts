import { z } from 'zod'

export const domainActionEnum = z.enum(['create', 'trade', 'update', 'delete'])
