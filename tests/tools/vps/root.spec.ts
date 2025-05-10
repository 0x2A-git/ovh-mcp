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

import { getVPSTool, registerVPSRootTools } from '../../../src/tools/vps/root'
import * as utils from '../../../src/utils'

describe('VPS root tools', () => {
    test('should return VPS list', async () => {
        const vpsMock = ['vps-abcdefgh.vps.ovh.net', 'vps-12345678.vps.ovh.net']

        const toolDescription = getVPSTool

        ovhClientRequestClientMock.mockImplementation(() => vpsMock)

        const result: any = await toolDescription.cb({}, {} as any)

        const content = JSON.parse(result['content'][0]['text'])

        const vps = content['vps']

        expect(vps).toEqual(vpsMock)
    })

    test('should handle VPS list errors', async () => {
        const errorMock = JSON.stringify({
            error: 400,
            message: 'Error mock',
        })

        const toolDescription = getVPSTool

        ovhClientRequestClientMock.mockImplementation(() =>
            Promise.reject(errorMock)
        )

        const result: any = await toolDescription.cb({}, {} as any)

        const content = JSON.parse(result['content'][0]['text'])

        expect(content).toEqual(errorMock)
    })

    test('should register root tools', async () => {
        const registerToolMock = jest.fn()

        jest.spyOn(utils, 'registerTool').mockImplementation(registerToolMock)

        registerVPSRootTools({
            tool: jest.fn(),
        } as any)

        expect(registerToolMock).toHaveBeenCalled()
    })
})
