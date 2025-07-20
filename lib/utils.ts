import { ColorPaletteProp, Theme } from "@mui/joy";
import { PlatformProps, ResponseProps } from "./definitions";
import crypto from "crypto";

const secretToken = Buffer.from(process.env.ENCRYPT_SECRET || "", "hex");
if (!secretToken) throw new Error("Missing encryption secret");

export function applyGradientColors(theme: Theme, mode: "dark" | "light" | "system" | undefined, color: ColorPaletteProp = "primary") {
	if (mode === "dark") {
		return { center: theme.palette[color][700], edge: theme.palette[color][900] };
	} else return { center: theme.palette[color][50], edge: theme.palette[color][200] };
}
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
export function parseClientPrismaError(error: unknown, tableName: string): { message: string; name: string } {
	const name = capitalizeString(tableName);
	if (error && typeof error == "object" && "code" in error && "name" in error && "message" in error) {
		switch (error["code"]) {
			case "P2002": {
				error.name = `Duplicate${name}RecordEntryError`;
				error.message = `${name} record already exists in the database`;
				throw { status: "fail", statusCode: 409, errors: { key: error.message } } as ResponseProps;
			}
			default:
				break;
		}
	}
	throw error;
}
export function capitalizeString(string: string) {
	const capitalized = string.slice(0, 1).toUpperCase();
	const lowerCase = string.slice(1).toLowerCase();
	return capitalized + lowerCase;
}
export function encrypt(value: string) {
	const iv = crypto.randomBytes(12);
	const cipher = crypto.createCipheriv("aes-128-ccm", secretToken, iv, { authTagLength: 16 });
	const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);
	const authTag = cipher.getAuthTag();

	return { encrypted, iv, authTag };
}
export function decrypt(encrypted: string, iv: string, authTag: string) {
	const decipher = crypto.createDecipheriv("aes-128-ccm", secretToken, Buffer.from(iv, "hex"), { authTagLength: 16 });
	decipher.setAuthTag(Buffer.from(authTag, "hex"));
	const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, "hex")), decipher.final()]);
	return decrypted.toString("utf-8");
}
export function generateKeyHash(key: string) {
	return crypto.createHash("sha-256").update(key).digest("hex");
}
