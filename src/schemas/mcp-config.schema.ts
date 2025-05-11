import { z } from 'zod'

export const mcpConfigSchema = z.object({
    PORT: z.coerce
        .number()
        .min(1, 'Minimum port range is 1')
        .max(65535, 'Maximum port range is 65355'),
    OVH_API_APPLICATION_KEY: z
        .string()
        .nonempty('OVH_API_CONSUMER_KEY is required'),
    OVH_API_APPLICATION_SECRET: z
        .string()
        .nonempty('OVH_API_APPLICATION_SECRET is required'),
    OVH_API_CONSUMER_KEY: z
        .string()
        .nonempty('OVH_API_CONSUMER_KEY is required'),
    SSH_PRIVATE_KEY_FILE: z.string(),
})
