import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { OAuth2Client } from "google-auth-library";
import { BaseToolHandler } from "./BaseToolHandler.js";
import { calendar_v3 } from "googleapis";
import { ClientManager } from "../../auth/clientManager.js";
import { ListColorsArgumentsSchema } from "../../schemas/validators.js";

export class ListColorsHandler extends BaseToolHandler {
    async runTool(args: any, clientManager: ClientManager): Promise<CallToolResult> {
        const validArgs = ListColorsArgumentsSchema.parse(args);
        const accessToken = validArgs.accessToken;
        delete (validArgs as any).accessToken;
        const oauth2Client = await clientManager.getClient(accessToken);

        const colors = await this.listColors(oauth2Client);
        return {
            content: [{
                type: "text",
                text: `Available event colors:\n${this.formatColorList(colors)}`,
            }],
        };
    }

    private async listColors(client: OAuth2Client): Promise<calendar_v3.Schema$Colors> {
        try {
            const calendar = this.getCalendar(client);
            const response = await calendar.colors.get();
            if (!response.data) throw new Error('Failed to retrieve colors');
            return response.data;
        } catch (error) {
            throw this.handleGoogleApiError(error);
        }
    }

    /**
     * Formats the color information into a user-friendly string.
     */
    private formatColorList(colors: calendar_v3.Schema$Colors): string {
        const eventColors = colors.event || {};
        return Object.entries(eventColors)
            .map(([id, colorInfo]) => `Color ID: ${id} - ${colorInfo.background} (background) / ${colorInfo.foreground} (foreground)`)
            .join("\n");
    }
}
