import { createTool, registerTool } from '../../utils'
import { OVHClient } from '../../core/ovh-client'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import { logger } from '../../lib'
import { serviceName } from '../../schemas/service.schema'

const vpsServiceToolsLogger = logger.child({
    moduleName: 'VPS - Service Tools',
})

export const getVPSServicePropertiesTool = createTool(
    'vps_service_properties',
    'Get Virtual Private Servers properties',
    {
        serviceName: serviceName,
    },
    {},
    async (args, extra) => {
        vpsServiceToolsLogger.info(
            `Retrieving VPS ${args.serviceName} properties...`
        )

        let properties: object | null = null

        try {
            properties = await OVHClient.requestPromised(
                'GET',
                `/vps/${args.serviceName}`
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
            vps_properties: properties,
        })

        vpsServiceToolsLogger.info(
            `Done retrieving VPS ${args.serviceName} properties !`
        )

        return {
            content: [{ type: 'text', text: output }],
        }
    }
)

export const getConsoleUrlVPSServiceTool = createTool(
    'vps_service_get_console_url',
    'Return the VPS console URL',
    {
        serviceName: serviceName,
    },
    {},
    async (args, extra) => {
        vpsServiceToolsLogger.info(
            `Retrieving VPS '${args.serviceName}' console URL...`
        )

        let consoleUrl: string | null = null

        try {
            consoleUrl = await OVHClient.requestPromised(
                'POST',
                `/vps/${args.serviceName}/getConsoleUrl`
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
            console_url: consoleUrl,
        })

        vpsServiceToolsLogger.info(
            `Done retrieving VPS '${args.serviceName}' console URL !`
        )

        return {
            content: [{ type: 'text', text: output }],
        }
    }
)

export const rebootVPSServiceTool = createTool(
    'vps_service_reboot',
    'Request a reboot of the Virtual Private Server machine',
    {
        serviceName: serviceName,
    },
    {},
    async (args, extra) => {
        vpsServiceToolsLogger.info(
            `Sending reboot command to VPS ${args.serviceName}...`
        )

        let status: object | null = null

        try {
            status = await OVHClient.requestPromised(
                'POST',
                `/vps/${args.serviceName}/reboot`
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
            status: status,
        })

        vpsServiceToolsLogger.info(
            `Done sending reboot command to VPS ${args.serviceName} !`
        )

        return {
            content: [{ type: 'text', text: output }],
        }
    }
)

export const registerVPSServiceTools = (server: McpServer) => {
    registerTool(getVPSServicePropertiesTool, server)
    registerTool(getConsoleUrlVPSServiceTool, server)
    registerTool(rebootVPSServiceTool, server)
}
