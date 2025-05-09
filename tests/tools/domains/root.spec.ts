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
    getManagedDomainsTool,
    registerDomainsRootTools,
} from '../../../src/tools/domains/root'
import * as utils from '../../../src/utils'

describe('Domains root tools', () => {
    test('should return domain names', async () => {
        const domainNamesMock = ['mydomain.com', 'foobar.fr']

        const toolDescription = getManagedDomainsTool

        ovhClientRequestClientMock.mockImplementation(() => domainNamesMock)

        const result: any = await toolDescription.cb({}, {} as any)

        const content = JSON.parse(result['content'][0]['text'])

        const domains = content['domains']

        expect(domains).toEqual(domainNamesMock)
    })

    test('should register root tools', async () => {
        const registerToolMock = jest.fn()

        jest.spyOn(utils, 'registerTool').mockImplementation(registerToolMock)

        registerDomainsRootTools({
            tool: jest.fn(),
        } as any)

        expect(registerToolMock).toHaveBeenCalled()
    })
})
