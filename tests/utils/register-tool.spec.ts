import { createTool } from '../../src/utils/create-tool'
import { registerTool } from '../../src/utils/register-tool'
import { z, ZodRawShape } from 'zod'

describe('Utils register tools', () => {
    const createMockTool = (schema: ZodRawShape) => {
        const mockName = 'My tool'
        const mockDesc = 'This is my tool'
        const mockParamsSchema = schema
        const mockAnnotations = {
            title: 'My Tool Title',
        }

        const mockCb: any = ({ name }: any, extra: any) => ({
            content: [{ type: 'text', text: name }],
        })

        const tool = createTool(
            mockName,
            mockDesc,
            mockParamsSchema,
            mockAnnotations,
            mockCb
        )

        return tool
    }
    test('should register tool with schema', () => {
        const tool = createMockTool({
            name: z.string(),
        })

        const toolRegisterFunc = jest.fn()
        const server: any = {
            tool: toolRegisterFunc,
        }
        registerTool(tool, server)
        expect(toolRegisterFunc).toHaveBeenCalled()
    })

    test('should register tool without schema', () => {
        const tool = createMockTool({})

        const toolRegisterFunc = jest.fn()
        const server: any = {
            tool: toolRegisterFunc,
        }
        registerTool(tool, server)
        expect(toolRegisterFunc).toHaveBeenCalled()
    })
})
