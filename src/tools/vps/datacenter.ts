import { createTool, registerTool } from '../../utils'
import { OVHClient } from '../../core/ovh-client'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import { logger } from '../../lib'
import { countryEnum } from '../../schemas'

const vpsDatacenterToolsLogger = logger.child({
    moduleName: 'VPS - Datacenter Tools',
})

export const getVPSDatacentersTool = createTool(
    'vps_datacenter_list',
    'List all the datacenters for a specific country',
    {
        country: countryEnum,
    },
    {},
    async (args, extra) => {
        vpsDatacenterToolsLogger.info('Retrieving VPS datacenter list...')

        let datacenters: object | null = null

        try {
            datacenters = await OVHClient.requestPromised(
                'GET',
                '/vps/datacenter',
                {
                    country: args.country,
                }
            )
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
            datacenters: datacenters,
        })

        vpsDatacenterToolsLogger.info('Done retrieving VPS datacenter list !')

        return {
            content: [{ type: 'text', text: output }],
        }
    }
)

export const registerVPSDatacenterTools = (server: McpServer) => {
    registerTool(getVPSDatacentersTool, server)
}
