import 'dotenv/config'
import { mcpConfigSchema } from './schemas/mcp-config.schema'

const PORT = process.env.PORT || 8000

mcpConfigSchema.parse({
    PORT: PORT,
    OVH_API_APPLICATION_KEY: process.env.OVH_API_APPLICATION_KEY,
    OVH_API_APPLICATION_SECRET: process.env.OVH_API_APPLICATION_SECRET,
    OVH_API_CONSUMER_KEY: process.env.OVH_API_CONSUMER_KEY,
    SSH_PRIVATE_KEY_FILE: process.env.SSH_PRIVATE_KEY_FILE,
})

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js'
import express from 'express'
import { logger } from './lib'
import { registerDomainsTools } from './tools/domains/index'
import { registerVPSTools } from './tools/vps'

const serverLogger = logger.child({
    moduleName: 'Server',
})

serverLogger.info('Initializing server...')

const app = express()

// Create an MCP server
const server = new McpServer({
    name: 'ovh-mcp',
    version: '1.0.0',
})

registerDomainsTools(server)
registerVPSTools(server)

// Endpoints

let transport: SSEServerTransport | null = null
app.get('/sse', (req, res) => {
    transport = new SSEServerTransport('/messages', res)
    server.connect(transport)
})

app.post('/messages', (req, res) => {
    if (transport) {
        transport.handlePostMessage(req, res)
    }
})

// Listen
app.listen(PORT, (err) => {
    if (err) {
        serverLogger.error(err)
    } else {
        serverLogger.info(`OVH MCP Server running on port ${PORT} 🎉`)
    }
})
