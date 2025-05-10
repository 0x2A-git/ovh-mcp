import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import 'dotenv/config'
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js'
import express from 'express'
import { registerDomainsTools } from './tools/domains/index'
import { logger } from './lib'
import { registerVPSTools } from './tools/vps'

const serverLogger = logger.child({
    moduleName: 'Server',
})

serverLogger.info('Initializing server...')

const PORT = process.env.PORT || 8000

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
