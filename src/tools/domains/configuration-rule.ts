import { createTool, registerTool } from '../../utils'
import { OVHClient } from '../../core/ovh-client'
import { z } from 'zod'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import { domainActionEnum } from './schemas/domain-action.schema'
import { logger } from '../../lib'

const configurationRuleToolsLogger = logger.child({
    moduleName: 'Domains - Configuration Rule Tools',
})

export const getConfigurationRuleTool = createTool(
    'get_configuration_rule',
    'Get configuration rule applied for a domain in a given action',
    {
        domainName: z
            .string()
            .min(3, 'Domain name too short')
            .max(253, 'Domain name too long'),
        actionName: domainActionEnum,
    },
    {},
    async (args, extra) => {
        configurationRuleToolsLogger.info(
            `Retrieving domains configuration rule '${args.actionName}' for domain '${args.domainName}'...`
        )
        const configurationRule = await OVHClient.requestPromised(
            'GET',
            '/domain/configurationRule',
            { domain: args.domainName, action: args.actionName }
        )

        const output = JSON.stringify({
            domain_name: args.domainName,
            action_name: args.actionName,
            configuration_rule: configurationRule,
        })

        configurationRuleToolsLogger.info(
            `Done retrieving domains configuration rule '${args.actionName}' for domain '${args.domainName}' !`
        )

        return {
            content: [{ type: 'text', text: output }],
        }
    }
)

// TODO : implement
// export const checkConfigurationRuleTool = createTool(
//   "check_configuration_rule",
//   "Validate a rule data for a specified domain",
//   {
//     domainName: z
//       .string()
//       .min(3, "Domain name too short")
//       .max(253, "Domain name too long"),
//     domainAction: domainActionEnum,

//     adminAccount: contactSchema.nullable(),
//     domain: domainSchema.nullable(),
//     extras: z.object({
//       acceptCondition: z.boolean().nullable(),
//       authInfo: z.string().nullable(),
//     }),
//     owner: ownerSchema.nullable(),
//     techAccount: contactSchema.nullable(),
//   },
//   {},
//   async ({ domainName, domainAction }, extra) => {
//     const configurationRule = await OVHClient.requestPromised(
//       "POST",
//       "/domain/configurationRule/check",
//       { domainName, domainAction }
//     );

//     const output = JSON.stringify({
//       domain_name: domainName,
//       action_name: domainAction,
//       configuration_rule: configurationRule,
//     });

//     return {
//       content: [{ type: "text", text: output }],
//     };
//   }
// );

export const registerDomainsConfigurationRuleTools = (server: McpServer) => {
    registerTool(getConfigurationRuleTool, server)
    // registerTool(checkConfigurationRuleTool, server);
}
