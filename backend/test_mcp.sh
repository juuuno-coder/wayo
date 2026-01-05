echo "--- Search Events ---"
curl -X POST http://localhost:3401/mcp/gabojago/messages \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_events","arguments":{"keyword":"축제"}}}'

echo "

--- Get Event Detail (ID: 2) ---"
curl -X POST http://localhost:3401/mcp/gabojago/messages \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_event_detail","arguments":{"event_id": 2}}}'

