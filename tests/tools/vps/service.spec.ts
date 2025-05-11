import * as fs from 'fs/promises'
import * as sshClientLib from '../../../src/lib/ssh2/client'
import { Client as SSHClient } from 'ssh2'

jest.mock('fs/promises')
import * as Client from '@ovhcloud/node-ovh'

const ovhClientRequestClientMock = jest.fn()

jest.mock('@ovhcloud/node-ovh', () => {
    return {
        __esModule: true,
        default: jest.fn(() => ({
            requestPromised: ovhClientRequestClientMock,
        })),
    }
})

import {
    executeCommandsVPSServiceTool,
    getConsoleUrlVPSServiceTool,
    getIPAddressesVPSServiceTool,
    getVPSServicePropertiesTool,
    rebootVPSServiceTool,
    registerVPSServiceTools,
} from '../../../src/tools/vps/service'
import * as utils from '../../../src/utils'
import { SSHCommandExecutionResult } from '../../../src/lib/ssh2/client'

describe('VPS service tools', () => {
    /**
     * API Tools
     */
    test('should return VPS properties', async () => {
        const vpsMock = {
            netbootMode: 'local',
            offerType: 'ssd',
            memoryLimit: 4096,
            name: 'vps-abcdefgh.vps.ovh.net',
            zone: 'Region OpenStack: os-gra1',
            cluster: '',
            slaMonitoring: false,
            model: {
                maximumAdditionnalIp: 16,
                version: '2019v1',
                name: 'vps-le-4-4-80',
                vcore: 4,
                datacenter: [],
                offer: 'VPS vps2023-le-4',
                disk: 80,
                availableOptions: [],
                memory: 4096,
            },
            keymap: null,
            zoneType: 'region',
            vcore: 4,
            state: 'running',
            displayName: 'vps-abcdefgh.vps.ovh.net',
            monitoringIpBlocks: [],
            iam: {
                id: 'b11eed46-29a0-4835-a866-a211609ff30f',
                urn: 'urn:v1:eu:resource:vps:vps-abcdefgh.vps.ovh.net',
            },
        }

        const toolDescription = getVPSServicePropertiesTool

        ovhClientRequestClientMock.mockImplementation(() => vpsMock)

        const result: any = await toolDescription.cb(
            {
                serviceName: 'vps-abcdefgh.vps.ovh.net',
            },
            {} as any
        )

        const content = JSON.parse(result['content'][0]['text'])

        const vps = content['vps_properties']

        expect(vps).toEqual(vpsMock)
    })

    test('should handle VPS properties errors', async () => {
        const errorMock = JSON.stringify({
            error: 400,
            message: 'Error mock',
        })

        const toolDescription = getVPSServicePropertiesTool

        ovhClientRequestClientMock.mockImplementation(async () =>
            Promise.reject(errorMock)
        )

        const result: any = await toolDescription.cb(
            {
                serviceName: 'vps-abcdefgh.vps.ovh.net',
            },
            {} as any
        )

        const content = JSON.parse(result['content'][0]['text'])

        expect(content).toEqual(errorMock)
    })

    test('should return VPS console url', async () => {
        const consoleUrlMock =
            'https://compute.gra1.cloud.ovh.net:6080/vnc_lite.html?path=%3Ftoken%e11cb978-1d59-4669-b7a7-72eed9b7cd3a'

        const toolDescription = getConsoleUrlVPSServiceTool

        ovhClientRequestClientMock.mockImplementation(() => consoleUrlMock)

        const result: any = await toolDescription.cb(
            {
                serviceName: 'vps-abcdefgh.vps.ovh.net',
            },
            {} as any
        )

        const content = JSON.parse(result['content'][0]['text'])

        const consoleUrl = content['console_url']

        expect(consoleUrl).toEqual(consoleUrlMock)
    })

    test('should handle VPS console url errors', async () => {
        const errorMock = JSON.stringify({
            error: 400,
            message: 'Error mock',
        })

        const toolDescription = getConsoleUrlVPSServiceTool

        ovhClientRequestClientMock.mockImplementation(() =>
            Promise.reject(errorMock)
        )

        const result: any = await toolDescription.cb(
            {
                serviceName: 'vps-abcdefgh.vps.ovh.net',
            },
            {} as any
        )

        const content = JSON.parse(result['content'][0]['text'])

        expect(content).toEqual(errorMock)
    })

    test('should return VPS ip addresses', async () => {
        const ipAddressesMock = ['123.123.123.123', '1234:1234:123:123::1234']

        const toolDescription = getIPAddressesVPSServiceTool

        ovhClientRequestClientMock.mockImplementation(() => ipAddressesMock)

        const result: any = await toolDescription.cb(
            {
                serviceName: 'vps-abcdefgh.vps.ovh.net',
            },
            {} as any
        )

        const content = JSON.parse(result['content'][0]['text'])

        const ipAddresses = content['ip_addresses']

        expect(ipAddresses).toEqual(ipAddressesMock)
    })

    test('should handle VPS return ip addresses errors', async () => {
        const errorMock = JSON.stringify({
            error: 400,
            message: 'Error mock',
        })

        const toolDescription = getIPAddressesVPSServiceTool

        ovhClientRequestClientMock.mockImplementation(() =>
            Promise.reject(errorMock)
        )

        const result: any = await toolDescription.cb(
            {
                serviceName: 'vps-abcdefgh.vps.ovh.net',
            },
            {} as any
        )

        const content = JSON.parse(result['content'][0]['text'])

        expect(content).toEqual(errorMock)
    })

    test('should reboot VPS', async () => {
        const responseMock = {
            status: {
                date: '2025-01-01T00:00:00+02:00',
                state: 'todo',
                id: 10000000,
                type: 'rebootVm',
                progress: 0,
            },
        }

        const toolDescription = rebootVPSServiceTool

        ovhClientRequestClientMock.mockImplementation(() => responseMock)

        const result: any = await toolDescription.cb(
            {
                serviceName: 'vps-abcdefgh.vps.ovh.net',
            },
            {} as any
        )

        const content = JSON.parse(result['content'][0]['text'])

        const status = content['status']

        expect(status).toEqual(responseMock)
    })

    test('should handle VPS reboot errors', async () => {
        const errorMock = JSON.stringify({
            error: 400,
            message: 'Error mock',
        })

        const toolDescription = rebootVPSServiceTool

        ovhClientRequestClientMock.mockImplementation(async () =>
            Promise.reject(errorMock)
        )

        const result: any = await toolDescription.cb(
            {
                serviceName: 'vps-abcdefgh.vps.ovh.net',
            },
            {} as any
        )

        const content = JSON.parse(result['content'][0]['text'])

        expect(content).toEqual(errorMock)
    })

    /**
     * Custom Tools
     */

    test('should execute ssh commands', async () => {
        const sshResponseMock: SSHCommandExecutionResult = {
            code: 0,
            signal: null,
            data: 'Hello world !',
        }

        const hostMock = '123.123.123.123'
        const sshPortMock = 22
        const commandsMock = ['cat file.txt']
        const usernameMock = 'ai'

        jest.spyOn(fs, 'readFile').mockImplementation(() =>
            Promise.resolve('Private key mock')
        )

        jest.spyOn(SSHClient.prototype, 'connect').mockImplementation(
            (opts) => Promise.resolve() as any
        )

        jest.spyOn(sshClientLib, 'sshClientReady').mockImplementation(
            (client) => Promise.resolve()
        )

        jest.spyOn(sshClientLib, 'sshSendCommand').mockImplementation(
            (client, command, rawOutput) => Promise.resolve(sshResponseMock)
        )

        jest.spyOn(SSHClient.prototype, 'end').mockImplementationOnce(
            () => Promise.resolve() as any
        )

        const toolDescription = executeCommandsVPSServiceTool

        const toolResult: any = await toolDescription.cb(
            {
                vpsIpAddress: hostMock,
                sshPort: sshPortMock,
                commands: commandsMock,
                username: usernameMock,
            },
            {} as any
        )

        const content = JSON.parse(toolResult['content'][0]['text'])

        const commandsResult = content['commands_result']

        expect(commandsResult).toEqual([sshResponseMock])
    })

    test('should handle execute ssh commands fails', async () => {
        const hostMock = '123.123.123.123'
        const sshPortMock = 22
        const commandsMock = ['cat file.txt']
        const usernameMock = 'ai'

        const errorMock = JSON.stringify({
            error: 400,
            message: 'Error mock',
        })

        const toolDescription = executeCommandsVPSServiceTool

        jest.spyOn(fs, 'readFile').mockImplementation(() =>
            Promise.reject(errorMock)
        )

        const result: any = await toolDescription.cb(
            {
                vpsIpAddress: hostMock,
                sshPort: sshPortMock,
                commands: commandsMock,
                username: usernameMock,
            },
            {} as any
        )

        const content = JSON.parse(result['content'][0]['text'])

        expect(content).toEqual(errorMock)
    })

    test('should register service tools', async () => {
        const registerToolMock = jest.fn()

        jest.spyOn(utils, 'registerTool').mockImplementation(registerToolMock)

        registerVPSServiceTools({
            tool: jest.fn(),
        } as any)

        expect(registerToolMock).toHaveBeenCalled()
    })
})
