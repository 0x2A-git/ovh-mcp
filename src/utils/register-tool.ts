import { ToolDescription } from '../types/tool-description.type'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import { ZodRawShape } from 'zod'

export function registerTool<Args extends ZodRawShape>(
    tool: ToolDescription<Args>,
    server: McpServer
) {
    const hasSchema = Object.keys(tool.paramsSchema).length > 0

    // If we call this signature with empty schema we'll get cb is not a function, hence why condition
    if (hasSchema) {
        server.tool(
            tool.name,
            tool.description,
            tool.paramsSchema,
            tool.annotations,
            tool.cb
        )
    } else {
        server.tool(tool.name, tool.description, tool.annotations, tool.cb)
    }
}
