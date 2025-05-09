import { createTool } from '../../src/utils/create-tool'
import { z } from 'zod'

describe('Utils create tools', () => {
    test('should create tool', () => {
        const expectedName = 'My tool'
        const expectedDesc = 'This is my tool'
        const expectedParamsSchema = {
            name: z.string(),
        }
        const expectedAnnotations = {
            title: 'My Tool Title',
        }

        const expectedCb: any = ({ name }: any, extra: any) => ({
            content: [{ type: 'text', text: name }],
        })

        const tool = createTool(
            expectedName,
            expectedDesc,
            expectedParamsSchema,
            expectedAnnotations,
            expectedCb
        )

        expect(tool.name).toEqual(expectedName)
        expect(tool.description).toEqual(expectedDesc)
        expect(tool.paramsSchema).toEqual(expectedParamsSchema)
        expect(tool.annotations).toEqual(expectedAnnotations)

        const nameMock = 'John'
        expect(expectedCb({ name: nameMock }, {})).toEqual(
            tool.cb({ name: nameMock }, {} as any)
        )
    })
})
