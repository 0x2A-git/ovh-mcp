import { z } from 'zod'

export const domainPurposeEnum = z.enum([
    'campaign_website',
    'educational_website',
    'emails',
    'information_website',
    'other_purpose',
    'redirect_page',
    'transactional_website',
])
