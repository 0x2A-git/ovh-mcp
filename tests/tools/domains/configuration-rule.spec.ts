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
    getConfigurationRuleTool,
    registerDomainsConfigurationRuleTools,
} from '../../../src/tools/domains/configuration-rule'
import * as utils from '../../../src/utils'

describe('Domains configuration rule tools', () => {
    test('should return configuration rule details', async () => {
        const actionNameMock = 'update'
        const domainNameMock = 'foobar.com'

        const toolDescription = getConfigurationRuleTool

        const ovhResponseMock = {} // Partial representation because too many fields
        ovhClientRequestClientMock.mockImplementation(() => ovhResponseMock)

        const result: any = await toolDescription.cb(
            { actionName: actionNameMock, domainName: domainNameMock },
            {} as any
        )

        const content = JSON.parse(result['content'][0]['text'])

        expect(content.domain_name).toEqual(domainNameMock)
        expect(content.action_name).toEqual(actionNameMock)
        expect(content.configuration_rule).toEqual(ovhResponseMock)
    })

    test('should register configuration rule tools', async () => {
        const registerToolMock = jest.fn()

        jest.spyOn(utils, 'registerTool').mockImplementation(registerToolMock)

        registerDomainsConfigurationRuleTools({
            tool: jest.fn(),
        } as any)

        expect(registerToolMock).toHaveBeenCalled()
    })
})
