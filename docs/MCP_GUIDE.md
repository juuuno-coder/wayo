# Gabojago MCP Server Guide

## Overview

This guide explains how to run and test the Model Context Protocol (MCP) server integration for Gabojago.
The MCP server allows AI agents (PlayMCP, Claude, etc.) to query Gabojago's database directly.

## Endpoints

- **Namespace**: `[Gabojago] Festival Agent`
- **SSE Endpoint**: `GET /mcp/gabojago/sse`
- **Messages Endpoint**: `POST /mcp/gabojago/messages`

## Prerequisites

- Rails Server running (`bin/rails s`)
- Public HTTPS URL (for actual connection with PlayMCP) - Use `ngrok` or deploy to staging.

## Local Testing (curl)

### 1. Check Connection (Manual)

You can test the MCP tool definition by sending a direct JSON-RPC request to the messages endpoint.

```bash
# Get Tool List
curl -X POST http://localhost:3000/mcp/gabojago/messages \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'
```

```bash
# Call Tool (Search Events)
curl -X POST http://localhost:3000/mcp/gabojago/messages \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "search_events",
      "arguments": {
        "keyword": "축제",
        "region": "서울"
      }
    }
  }'
```

## Registering on PlayMCP

1. **Expose Localhost**:
   Run ngrok or similar tunnel:

   ```bash
   ngrok http 3000
   ```

   Copy the `https://....ngrok-free.app` URL.

2. **Go to PlayMCP Console**:

   - URL: https://playmcp.kakao.com
   - Add "Remote MCP".
   - Enter your SSE Endpoint: `https://<your-ngrok-url>/mcp/gabojago/sse`

3. **Test in Chat**:
   - Ask: "이번 주말 서울 축제 알려줘"
   - Verify it calls your tool.
