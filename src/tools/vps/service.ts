import { createTool, registerTool } from '../../utils'
import { OVHClient } from '../../core/ovh-client'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import { logger } from '../../lib'
import { serviceName } from '../../schemas/service.schema'
import { z } from 'zod'
import { Client } from 'ssh2'

import {
    sshClientReady,
    SSHCommandExecutionResult,
    sshSendCommand,
} from '../../lib/ssh2/client'
import { readFile } from 'fs/promises'

const vpsServiceToolsLogger = logger.child({
    moduleName: 'VPS - Service Tools',
})

/**
 * API tools
 */

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

export const getIPAddressesVPSServiceTool = createTool(
    'vps_service_get_ip_addresses',
    'Return IP addresses associated to given VPS',
    {
        serviceName: serviceName,
    },
    {},
    async (args, extra) => {
        vpsServiceToolsLogger.info(
            `Retrieving IP addresses for VPS '${args.serviceName}'...`
        )

        let ipAddresses: string[] | null = null

        try {
            ipAddresses = await OVHClient.requestPromised(
                'GET',
                `/vps/${args.serviceName}/ips`
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
            ip_addresses: ipAddresses,
        })

        vpsServiceToolsLogger.info(
            `Done retrieving IP addresses for VPS '${args.serviceName}' !`
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

/**
 * Custom tools
 */

export const executeCommandsVPSServiceTool = createTool(
    'vps_service_execute_commands',
    'Execute commands on given VPS',
    {
        vpsIpAddress: z.string().ip(),
        sshPort: z.coerce.number().min(1).max(65355),
        username: z.string().min(1).max(32),
        commands: z.array(z.string()),
    },
    {},
    async (args, extra) => {
        vpsServiceToolsLogger.info(
            `Executing ${args.commands.length} commands on VPS '${args.vpsIpAddress}'...`
        )

        let commandsResult: SSHCommandExecutionResult[] | null = null

        try {
            const aiPrivateKeyFile = await readFile(
                process.env.SSH_PRIVATE_KEY_FILE!
            )

            const sshClient = new Client()

            sshClient.connect({
                host: args.vpsIpAddress,
                port: args.sshPort,
                username: args.username,
                privateKey: aiPrivateKeyFile,
            })

            await sshClientReady(sshClient)

            const resultsPromises: Promise<SSHCommandExecutionResult>[] = []

            for (const command of args.commands) {
                resultsPromises.push(sshSendCommand(sshClient, command))
            }

            const results = await Promise.all(resultsPromises)

            commandsResult = results

            sshClient.end()

            vpsServiceToolsLogger.info(commandsResult)
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
            commands_result: commandsResult,
        })

        vpsServiceToolsLogger.info(
            `Done executing ${args.commands.length} commands on VPS '${args.vpsIpAddress}' !`
        )

        return {
            content: [{ type: 'text', text: output }],
        }
    }
)

export const registerVPSServiceTools = (server: McpServer) => {
    // API
    registerTool(getVPSServicePropertiesTool, server)
    registerTool(getConsoleUrlVPSServiceTool, server)
    registerTool(getIPAddressesVPSServiceTool, server)
    registerTool(rebootVPSServiceTool, server)
    // Custom
    registerTool(executeCommandsVPSServiceTool, server)
}
