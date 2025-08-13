import { PlatformProps, ResponseProps } from "./definitions";
import crypto from "crypto";
import GiveawayService from "./services/GiveawayService";

const secretToken = Buffer.from(process.env.ENCRYPT_SECRET || "", "hex");
if (secretToken.length !== 16) throw new Error("Missing ENCRYPT_SECRET environment variable - ensure it is 16 bytes in length");

export function isKeyValid(platform: PlatformProps["name"], key: string): boolean {
	const steamRegex =
		/^([A-Z0-9]{5}[A-Z0-9]{5}[A-Z0-9]{5}|[A-Z0-9]{5}\-[A-Z0-9]{5}\-[A-Z0-9]{5}|[A-Z0-9]{5}\-[A-Z0-9]{5}\-[A-Z0-9]{5}\-[A-Z0-9]{5}\-[A-Z0-9]{5}|[A-Z0-9]{5}[A-Z0-9]{5}[A-Z0-9]{5}[A-Z0-9]{5}[A-Z0-9]{5})$/i;
	const eaRegex = /^([A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{4})$/i;
	const ubisoftRegex = /^([A-Z0-9]{3}\-[A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{4}|[A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{4})$/i;
	const epicRegex = /^([A-Z0-9]{5}\-[A-Z0-9]{5}\-[A-Z0-9]{5}\-[A-Z0-9]{5}\-[A-Z0-9]{5})$/i;
	const gogRegex = /^([A-Z0-9]{5}\-[A-Z0-9]{5}\-[A-Z0-9]{5}\-[A-Z0-9]{5}\-[A-Z0-9]{5})$/i;
	const xboxRegex = /^([A-Z0-9]{5}\-[A-Z0-9]{5}\-[A-Z0-9]{5}\-[A-Z0-9]{5}\-[A-Z0-9]{5})$/i;
	const switchRegex = /^([A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{4})$/i;
	const playstationRegex = /^([A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{4})$/i;

	switch (platform) {
		case "steam": {
			return steamRegex.test(key.trim());
		}
		case "gog": {
			return gogRegex.test(key);
		}
		case "ea": {
			return eaRegex.test(key);
		}
		case "ubisoft": {
			return ubisoftRegex.test(key);
		}
		case "epic": {
			return epicRegex.test(key);
		}
		case "playstation": {
			return playstationRegex.test(key);
		}
		case "switch": {
			return switchRegex.test(key);
		}
		case "xbox": {
			return xboxRegex.test(key);
		}
		default:
			return false;
	}
}
export function parseClientPrismaError(error: unknown, tableName: string): { message: string; name: string } | null {
	const name = capitalizeString(tableName);
	const errorObj = { name: "", message: "" };
	if (error && typeof error == "object" && "code" in error && "name" in error && "message" in error) {
		switch (error["code"]) {
			case "P2002": {
				errorObj.name = `Duplicate${name}RecordEntryError`;
				errorObj.message = `${name} already exists in the database`;
				throw { status: "fail", statusCode: 409, errors: { [tableName.toLowerCase()]: errorObj.message } } as ResponseProps;
			}
			case "P2025": {
				errorObj.name = `Record${name}NotFoundError`;
				errorObj.message = `Failed to find ${name} record`;
				throw { status: "fail", statusCode: 404, errors: { [tableName.toLowerCase()]: errorObj.message } } as ResponseProps;
			}
			default:
				break;
		}
	}
	throw error;
}
export async function parseDiscordError(error: unknown, giveawayId?: number): Promise<ResponseProps | null> {
	const obj: { message: string | null; name: string | null; code: number | null } = { message: null, name: null, code: null };
	if (error && typeof error === "object" && "code" in error) {
		switch (error["code"]) {
			case 50007:
				obj.code = 50007;
				obj.name = "DiscordDirectMessagePrivacyError";
				obj.message = "User does not accept direct messages from this server - notify user to accept direct messages from members of the server";
				if (giveawayId) await GiveawayService.setGiveawayStatus(giveawayId, "failed", obj.message);
				break;
			case 50013:
				obj.code = 50013;
				obj.name = "DiscordMissingPermissionsError";
				obj.message = "Missing permissions - retry after permission changes";
				if (giveawayId)
				await GiveawayService.setGiveawayStatus(giveawayId, "failed", obj.message);
				break;
		}
	}

	if (!obj.code) return null;
	throw { status: "fail", statusCode: 403, message: obj.message } as ResponseProps;
}
export function capitalizeString(string: string) {
	const capitalized = string.slice(0, 1).toUpperCase();
	const lowerCase = string.slice(1).toLowerCase();
	return capitalized + lowerCase;
}
export function encrypt(value: string) {
	const iv = crypto.randomBytes(12);
	const cipher = crypto.createCipheriv("aes-128-gcm", secretToken, iv, { authTagLength: 16 });
	const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);
	const authTag = cipher.getAuthTag();

	return { encrypted, iv, authTag };
}
export function decrypt(encrypted: string, iv: string, authTag: string) {
	const decipher = crypto.createDecipheriv("aes-128-gcm", secretToken, Buffer.from(iv, "hex"), { authTagLength: 16 });
	decipher.setAuthTag(Buffer.from(authTag, "hex"));
	const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, "hex")), decipher.final()]);
	return decrypted.toString("utf-8");
}
export function generateKeyHash(key: string) {
	return crypto.createHash("sha256").update(key).digest("hex");
}
export function getGiveawayDurationInDateTime(days: number) {
	const time = new Date();
	const duration = 1000 * 60 * 60 * 24 * days;
	const deadline = new Date(time.getTime() + duration).toISOString();
	return deadline;
}
export function getGiveawayDurationInLocaleString(dateString: string) {
	const time = new Date(dateString);
	return time.toLocaleString();
}
export function getColorFromHexToInt(hex: string) {
	return parseInt(hex.replace("#", ""), 16);
}
export function isGiveawayExpired(giveawayDuration: Date) {
	const now = new Date(Date.now()).toISOString();
	const endDate = new Date(giveawayDuration).toISOString();
	return now > endDate;
}
export function getDiscordVariables() {
	const guildId = process.env.DISCORD_GUILD_ID;
	const giveawayChannelId = process.env.DISCORD_GIVEAWAY_CHANNEL_ID;
	const token = process.env.DISCORD_BOT_TOKEN;
	const serverUrl = process.env.DISCORD_SERVER_URL;
	const adminRoleId = process.env.DISCORD_ADMIN_ROLE_ID;
	const giveawayLogChannelId = process.env.DISCORD_GIVEAWAY_CHANNEL_LOG_ID;

	if (!guildId) throw new Error("Missing DISCORD_GUILD_ID environment variable");
	if (!giveawayChannelId) throw new Error("Missing DISCORD_GIVEAWAY_CHANNEL_ID");
	if (!token) throw new Error("Missing DISCORD_BOT_TOKEN environment variable");
	if (!serverUrl) throw new Error("Missing DISCORD_SERVER_URL environment variable");
	if (!adminRoleId) throw new Error("Missing DISCORD_ADMIN_ROLE_ID environment variable");
	return { guildId, giveawayChannelId, token, serverUrl, adminRoleId, giveawayLogChannelId };
}
