import { createTool, registerTool } from '../../utils'
import { OVHClient } from '../../core/ovh-client'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import { logger } from '../../lib'

const vpsRootToolsLogger = logger.child({
    moduleName: 'VPS - Root Tools',
})

export const getVPSTool = createTool(
    'vps_list',
    'List available Virtual Private Servers services',
    {},
    {},
    async (args, extra) => {
        vpsRootToolsLogger.info('Retrieving VPS list...')

        let vps: object | null = null

        try {
            vps = await OVHClient.requestPromised('GET', '/vps')
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
            vps: vps,
        })

        vpsRootToolsLogger.info('Done retrieving VPS list !')

        return {
            content: [{ type: 'text', text: output }],
        }
    }
)

export const registerVPSRootTools = (server: McpServer) => {
    registerTool(getVPSTool, server)
}
