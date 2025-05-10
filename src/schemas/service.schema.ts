import { z } from 'zod'

// TODO : find service name spec
export const serviceName = z.string().min(1).max(255)
