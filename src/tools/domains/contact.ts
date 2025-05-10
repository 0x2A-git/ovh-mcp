import { OVHClient } from '../../core/ovh-client'
import { createTool, registerTool } from '../../utils'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import { logger } from '../../lib'

const contactToolsLogger = logger.child({
    moduleName: 'Domains - Contact Tools',
})

export const getDomainsContactsTool = createTool(
    'domains_get_domain_contacts',
    'List all domain related contacts',
    {},
    {},
    async (args, extra) => {
        contactToolsLogger.info('Retrieving domains contacts...')

        let contacts: object | null = null

        try {
            contacts = await OVHClient.requestPromised('GET', '/domain/contact')
        } catch (err: unknown) {
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(err),
                    },
                ],
                isError: true,
            }
        }

        const output = JSON.stringify({
            contacts,
        })

        contactToolsLogger.info('Done retrieving domains contacts !')

        return {
            content: [{ type: 'text', text: output }],
        }
    }
)

export const registerDomainsContactTools = (server: McpServer) => {
    registerTool(getDomainsContactsTool, server)
}
