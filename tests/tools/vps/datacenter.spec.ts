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
    getVPSDatacentersTool,
    registerVPSDatacenterTools,
} from '../../../src/tools/vps/datacenter'
import * as utils from '../../../src/utils'

describe('VPS datacenter tools', () => {
    test('should return vps datacenters', async () => {
        const countryMock = 'FR'
        const ovhResponseMock = [
            'sbg',
            'syd',
            'sgp',
            'bhs',
            'waw',
            'gra',
            'uk1',
            'de1',
        ]

        const toolDescription = getVPSDatacentersTool

        ovhClientRequestClientMock.mockImplementation(() => ovhResponseMock)

        const result: any = await toolDescription.cb(
            { country: countryMock },
            {} as any
        )

        const content = JSON.parse(result['content'][0]['text'])

        expect(content.datacenters).toEqual(ovhResponseMock)
    })

    test('should handle vps datacenters errors', async () => {
        const countryMock = 'FR'

        const errorMock = JSON.stringify({
            error: 400,
            message: 'Error mock',
        })

        const toolDescription = getVPSDatacentersTool

        ovhClientRequestClientMock.mockImplementation(() =>
            Promise.reject(errorMock)
        )

        const result: any = await toolDescription.cb(
            { country: countryMock },
            {} as any
        )

        const content = JSON.parse(result['content'][0]['text'])

        expect(content).toEqual(errorMock)
    })

    test('should register datacenter tools', async () => {
        const registerToolMock = jest.fn()

        jest.spyOn(utils, 'registerTool').mockImplementation(registerToolMock)

        registerVPSDatacenterTools({
            tool: jest.fn(),
        } as any)

        expect(registerToolMock).toHaveBeenCalled()
    })
})
