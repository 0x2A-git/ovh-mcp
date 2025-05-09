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
    getDomainsContactsTool,
    registerDomainsContactTools,
} from '../../../src/tools/domains/contact'
import * as utils from '../../../src/utils'

describe('Domains contact tools', () => {
    test('should return contact details', async () => {
        const contactsMock = [
            {
                address: {
                    country: 'FR',
                    city: 'Paris',
                    zip: '75002',
                    line1: '18, Rue de la Paix',
                },
                email: 'john.doe@foo.com',
                firstName: 'John',
                id: 10000000,
                language: 'fr_FR',
                lastName: 'DOE',
                legalForm: 'individual',
                phone: '+33000000000',
            },
        ]

        const toolDescription = getDomainsContactsTool

        ovhClientRequestClientMock.mockImplementation(() => contactsMock)

        const result: any = await toolDescription.cb({}, {} as any)

        const content = JSON.parse(result['content'][0]['text'])

        const contacts = content['contacts']

        expect(contacts).toEqual(contactsMock)
    })

    test('should register contact tools', async () => {
        const registerToolMock = jest.fn()

        jest.spyOn(utils, 'registerTool').mockImplementation(registerToolMock)

        registerDomainsContactTools({
            tool: jest.fn(),
        } as any)

        expect(registerToolMock).toHaveBeenCalled()
    })
})
