import { createTool, registerTool } from '../../utils'
import { OVHClient } from '../../core/ovh-client'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import { logger } from '../../lib'

const managedDomainsToolsLogger = logger.child({
    moduleName: 'Domains - Managed Domains Tools',
})

export const getManagedDomainsTool = createTool(
    'domains_list',
    'Get the list of managed domain names',
    {},
    {},
    async (args, extra) => {
        managedDomainsToolsLogger.info('Retrieving managed domains...')

        const domains = await OVHClient.requestPromised('GET', '/domain')

        const output = JSON.stringify({
            domains: domains,
        })

        managedDomainsToolsLogger.info('Done retrieving managed domains !')
        return {
            content: [{ type: 'text', text: output }],
        }
    }
)

export const registerDomainsRootTools = (server: McpServer) => {
    registerTool(getManagedDomainsTool, server)
}
