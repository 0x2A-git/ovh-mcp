import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { registerVPSDatacenterTools } from "./datacenter";
import { registerVPSRootTools } from "./root";
import { registerVPSServiceTools } from "./service";

export function registerVPSTools(server: McpServer) {
  registerVPSRootTools(server);
  registerVPSServiceTools(server);
  registerVPSDatacenterTools(server);
}
