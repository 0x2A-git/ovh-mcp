import { ZodRawShape } from 'zod'
import { ToolDescription } from '../types/tool-description.type'
import { ToolAnnotations } from '@modelcontextprotocol/sdk/types'
import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp'

export function createTool<Args extends ZodRawShape>(
    name: string,
    description: string,
    paramsSchema: Args,
    annotations: ToolAnnotations,
    cb: ToolCallback<Args>
): ToolDescription<Args> {
    return {
        name,
        description,
        paramsSchema: paramsSchema,
        annotations: annotations,
        cb,
    }
}
