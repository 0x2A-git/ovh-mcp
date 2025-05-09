import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp'
import { ZodRawShape } from 'zod'
import { ToolAnnotations } from '@modelcontextprotocol/sdk/types'

export type ToolDescription<Args extends ZodRawShape> = {
    name: string
    description: string
    paramsSchema: Args
    annotations: ToolAnnotations
    cb: ToolCallback<Args>
}
