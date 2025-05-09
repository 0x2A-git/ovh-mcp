import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import { registerDomainsConfigurationRuleTools } from './configuration-rule'
import { registerDomainsContactTools } from './contact'
import { registerDomainsRootTools } from './root.js'

export function registerDomainsTools(server: McpServer) {
    registerDomainsRootTools(server)
    registerDomainsConfigurationRuleTools(server)
    registerDomainsContactTools(server)
}
