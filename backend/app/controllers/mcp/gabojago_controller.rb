module Mcp
  class GabojagoController < ApplicationController
    include ActionController::Live


    def sse
      response.headers['Content-Type'] = 'text/event-stream'
      response.headers['Cache-Control'] = 'no-cache'
      response.headers['Connection'] = 'keep-alive'
      
      # Tell the client where to send POST messages
      # Using relative path assuming client follows standard resolution
      send_sse_event("endpoint", "/mcp/gabojago/messages")
      
      # Keep connection alive with heartbeats
      loop do
        send_sse_event("ping", "keep-alive")
        sleep 15
      end
    rescue IOError, ActionController::Live::ClientDisconnected
      # Client disconnected
      Rails.logger.info "MCP Client disconnected"
    ensure
      response.stream.close
    end

    def messages
      payload = JSON.parse(request.body.read)
      jsonrpc_req = payload
      
      # Handle batch or single request? MCP implies single usually via HTTP?
      # Spec says: "Transport agnostic", JSON-RPC 2.0.
      
      method = jsonrpc_req['method']
      id = jsonrpc_req['id']
      params = jsonrpc_req['params']

      response_result = nil
      
      case method
      when 'initialize'
        response_result = {
          protocolVersion: '2024-11-05',
          serverInfo: {
            name: 'gabojago-mcp',
            version: '1.0.0'
          },
          capabilities: {
            tools: {}
          }
        }
      when 'notifications/initialized'
        # No response needed for notifications, but we return empty to complete the flow if needed
        render json: { jsonrpc: "2.0", id: id, result: true } and return
      when 'tools/list'
        response_result = {
          tools: [
            {
              name: "search_events",
              description: "전국 축제 및 전시회 정보를 검색합니다. 지역, 날짜, 키워드로 필터링할 수 있습니다.",
              inputSchema: {
                type: "object",
                properties: {
                  keyword: { type: "string", description: "검색어 (예: '재즈', '불꽃축제', '비엔날레')" },
                  region: { type: "string", description: "지역명 (예: '서울', '강원', '부산')" },
                  date: { type: "string", description: "특정 날짜 (YYYY-MM-DD 형식). 해당 날짜에 진행 중인 행사를 찾습니다." }
                }
              }
            },
            {
              name: "get_event_detail",
              description: "특정 축제나 전시회의 상세 정보를 조회합니다. (가격, 예매처, 상세 설명 등)",
              inputSchema: {
                type: "object",
                properties: {
                  event_id: { type: "integer", description: "이벤트 ID (search_events 결과에서 확인 가능)" }
                },
                required: ["event_id"]
              }
            }
          ]
        }
      when 'tools/call'
        if params['name'] == 'search_events'
          events = perform_search(params['arguments'])
          response_result = {
            content: [
              {
                type: "text",
                text: format_events_result(events)
              }
            ]
          }
        elsif params['name'] == 'get_event_detail'
          event = Event.find_by(id: params['arguments']['event_id'])
          if event
            response_result = {
              content: [
                {
                  type: "text",
                  text: format_event_detail(event)
                }
              ]
            }
          else
            render json: { jsonrpc: "2.0", id: id, error: { code: -32602, message: "Event not found" } }, status: 404 and return
          end
        else
          # Error: Tool not found
          render json: { jsonrpc: "2.0", id: id, error: { code: -32601, message: "Tool not found" } }, status: 404 and return
        end
      when 'ping'
        response_result = {}
      else
        # Method not found
         # Usually we might ignore notifications but for 'call', we need to error
      end

      if id
        render json: { jsonrpc: "2.0", id: id, result: response_result }
      else
        head :ok
      end
    rescue => e
      Rails.logger.error "MCP Error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      if id
        render json: { jsonrpc: "2.0", id: id, error: { code: -32603, message: "Internal error: #{e.message}" } }, status: 500
      else
        head :internal_server_error
      end
    end

    private

    def send_sse_event(event, data)
      response.stream.write("event: #{event}\n")
      response.stream.write("data: #{data}\n\n")
    rescue IOError
      raise ActionController::Live::ClientDisconnected
    end

    def perform_search(args)
      scope = Event.all
      
      if args['keyword'].present?
        scope = scope.where("title LIKE ? OR description LIKE ?", "%#{args['keyword']}%", "%#{args['keyword']}%")
      end
      
      if args['region'].present?
        scope = scope.where("region LIKE ? OR location LIKE ?", "%#{args['region']}%", "%#{args['region']}%")
      end
      
      if args['date'].present?
        target_date = Date.parse(args['date']) rescue nil
        if target_date
          scope = scope.where("start_date <= ? AND end_date >= ?", target_date, target_date)
        end
      end
      
      scope.limit(5)
    end

    def format_events_result(events)
      if events.empty?
        return "조건에 맞는 축제 정보를 찾지 못했습니다. 다른 키워드나 날짜로 검색해 보세요."
      end

      events.map do |e|
        <<~markdown
          ### #{e.title} (ID: #{e.id})
          - **일정**: #{e.start_date} ~ #{e.end_date}
          - **장소**: #{e.location} (#{e.region})
          - **설명**: #{e.description&.truncate(100)}
          - **상세조회**: `get_event_detail` 도구를 사용하여 ID #{e.id}를 조회하세요.
          ![이미지](#{e.image_url})
        markdown
      end.join("\n\n")
    end

    def format_event_detail(e)
      <<~markdown
        # #{e.title}
        
        ![이미지](#{e.image_url})

        - **ID**: #{e.id}
        - **카테고리**: #{e.category}
        - **일정**: #{e.start_date} ~ #{e.end_date}
        - **장소**: #{e.location} (#{e.region})
        - **가격**: #{e.is_free ? '무료' : e.price}
        
        ## 상세 설명
        #{e.description}
        
        ---
        *이 정보는 가보자고(Gabojago)에서 제공되었습니다.*
      markdown
    end
  end
end
