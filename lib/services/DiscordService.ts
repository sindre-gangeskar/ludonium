import { DiscordMessageProps, DiscordEmbedProps, ResponseProps, DiscordAPIRequest } from "../definitions";
import { decrypt } from "../utils";
import KeyService from "./KeyService";

const discordApiUrl = process.env.DISCORD_API_URL;
const token = process.env.DISCORD_BOT_TOKEN;
const giveawayChannelId = process.env.DISCORD_GIVEAWAY_CHANNEL_ID;
const discordId = process.env.DISCORD_USER_ID;

if (!token) throw new Error("Missing Discord Bot Token in environment variables");
if (!giveawayChannelId) throw new Error("Missing Giveaway Channel ID in environment variables");
if (!discordApiUrl) throw new Error("Missing Discord API URL in environment variables");

export default class DiscordService {
	static async test() {
		try {
			const embed: DiscordEmbedProps = { title: "Test Giveaway Title", description: `Test Giveaway Description`, color: getColorFromHexToInt("#ffff92") };
			let body: DiscordMessageProps = { embeds: [embed], recipient_id: discordId };

			/* TEST KEY RETRIEVAL AND DECYRPTION */
			const key = await KeyService.getKey(12);
			if (key && "key" in key) {
				const decrypted = decrypt(key.key, key.iv, key.authTag);
				body = { embeds: [embed, { title: "Decrypted Game Key", description: `This key has been retrieved and deciphered from the database.`, fields: [{ name: "Key", value: decrypted, inline: false }] }] };
			}
			await this.sendDirectMessage(body);
			return { status: "success", statusCode: 200, message: "Successfully sent Discord Message" } as ResponseProps;
		} catch (error) {
			console.error(error);
			return { status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while sending embedded Discord message" } } as ResponseProps;
		}
	}
	static async sendChannelMessage(body: DiscordMessageProps) {
		try {
			const response = await fetchToDiscordAPI({ intent: "channel", channelId: giveawayChannelId ?? "", body: body });
			if (!response) throw new Error("Failed to receive response from Discord API");

			if (response.ok) return response;
			const data = await response.json();
			throw data;
		} catch (error) {
			console.error(error);
			return { status: "error", statusCode: 500, message: "An internal server error has occurred while sending channel message" } as ResponseProps;
		}
	}
	static async sendDirectMessage(body: DiscordMessageProps) {
		try {
			const createDmReq: DiscordAPIRequest = { intent: "create-dm-channel", recipient_id: discordId ?? "" };
			const directMessageResponse = await fetchToDiscordAPI(createDmReq);

			if (directMessageResponse && directMessageResponse.ok) {
				const data = await directMessageResponse.json();
				const messageReq: DiscordAPIRequest = { intent: "channel", channelId: data.id, body: body };
				return await fetchToDiscordAPI(messageReq);
			} else throw new Error("Failed to send direct message");
		} catch (error) {
			console.error(error);
			return { status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while sending direct message" } } as ResponseProps;
		}
	}
}

async function fetchToDiscordAPI(req: DiscordAPIRequest) {
	switch (req.intent) {
		case "channel": {
			return await fetch(`${discordApiUrl}/channels/${req.channelId}/messages`, {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bot ${token}` },
				body: JSON.stringify(req.body),
			});
		}
		case "guild": {
			break;
		}
		case "create-dm-channel": {
			return await fetch(`${discordApiUrl}/users/@me/channels`, {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bot ${token}` },
				body: JSON.stringify({ recipient_id: req.recipient_id }),
			});
		}
		default:
			break;
	}
}

function getColorFromHexToInt(hex: string) {
	return parseInt(hex.replace("#", ""), 16);
}
