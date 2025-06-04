import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { OAuth2Client } from "google-auth-library";
import { DeleteEventArgumentsSchema } from "../../schemas/validators.js";
import { BaseToolHandler } from "./BaseToolHandler.js";
import { z } from 'zod';
import { ClientManager } from "../../auth/clientManager.js";

export class DeleteEventHandler extends BaseToolHandler {
    async runTool(args: any, clientManager: ClientManager): Promise<CallToolResult> {
        const validArgs = DeleteEventArgumentsSchema.parse(args);
        const accessToken = validArgs.accessToken;
        delete (validArgs as any).accessToken;
        const oauth2Client = clientManager.getClient(accessToken);
        await this.deleteEvent(oauth2Client, validArgs);
        return {
            content: [{
                type: "text",
                text: "Event deleted successfully",
            }],
        };
    }

    private async deleteEvent(
        client: OAuth2Client,
        args: z.infer<typeof DeleteEventArgumentsSchema>
    ): Promise<void> {
        try {
            const calendar = this.getCalendar(client);
            await calendar.events.delete({
                calendarId: args.calendarId,
                eventId: args.eventId,
            });
        } catch (error) {
            throw this.handleGoogleApiError(error);
        }
    }
}
