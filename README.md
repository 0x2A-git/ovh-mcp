# 🚀 OVH MCP Server - Open Source OVH Model Context Protocol Server

[![GNU General Public License v3.0](https://github.com/0x2A-git/ovh-mcp/blob/main/LICENSE)](LICENSE)

> A secure, and scalable MCP Server to manage your OVH infrastructure using your favorite MCP client

---

## 🌐 About OVHCloud MCP Server

**OVH MCP Server** is an open-source platform designed to manage OVHCloud resources using the Model Context Protocol. This MCP Server enables efficient management through LLM.

---

## ☁️ Supported APIs

🚧 : Work In Progress

- [ ] **Dedicated Servers**
- [ ] **Virtual Private Servers** 🚧
- [ ] **AI & Machine Learning**
- [ ] **Domain Names** 🚧
- [ ] **Data Processing**
- [ ] **Hosted Private Cloud**
- [ ] **Managed Databases**
- [ ] **Managed Kubernetes**
- [ ] **Managed Registry**
- [ ] **Public Cloud Compute**
- [ ] **Public Cloud Storage**
- [ ] **Web PaaS**
- [ ] **Private Network**

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/0x2A-git/ovh-mcp.git && cd ovh-mcp

# Edit env file to add OVH credentials
cp .env.sample .env

# Run using Docker Compose
docker-compose up
```

## 🛠️ Full Setup

```bash
# Clone the repo
git clone https://github.com/0x2A-git/ovh-mcp.git && cd ovh-mcp

# Edit env file to add OVH credentials
cp .env.sample .env

# Install deps
npm ci

# Build
npm run build

# Run
node dist/src/index.js

# Dev only : Run tests with coverage
npm run test
```

List and try resources directly

```bash
 npx @modelcontextprotocol/inspector node dist/src/index.js
```

## 🤖 VSCode x Copilot Integration

Add the following in your settings.json file :

```json
{
    // ...
    "mcp": {
        "inputs": [],
        "servers": {
            "ovh-mcp": {
                "url": "http://localhost:8000/sse"
            }
        }
    }
}
```
