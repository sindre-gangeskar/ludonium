import { ColorPaletteProp, Theme } from "@mui/joy";
import { PlatformProps, ResponseProps } from "./definitions";

export function applyGradientColors(theme: Theme, mode: "dark" | "light" | "system" | undefined, color: ColorPaletteProp = "primary") {
	if (mode === "dark") {
		return { center: theme.palette[color][700], edge: theme.palette[color][900] };
	} else return { center: theme.palette[color][50], edge: theme.palette[color][200] };
}
export function isKeyValid(platform: PlatformProps["name"], key: string): boolean {
	const steamRegex =
		/^([A-Z0-9]{5}[A-Z0-9]{5}[A-Z0-9]{5}|[A-Z0-9]{5}\-[A-Z0-9]{5}\-[A-Z0-9]{5}|[A-Z0-9]{5}\-[A-Z0-9]{5}\-[A-Z0-9]{5}\-[A-Z0-9]{5}\-[A-Z0-9]{5}|[A-Z0-9]{5}[A-Z0-9]{5}[A-Z0-9]{5}[A-Z0-9]{5}[A-Z0-9]{5})$/i;
	switch (platform) {
		case "steam": {
			return steamRegex.test(key);
		}
		case "gog": {
			return true;
		}
		case "ea": {
			return true;
		}
		case "ubisoft": {
			return true;
		}
		case "epic": {
			return true;
		}
		case "playstation": {
			return true;
		}
		case "switch": {
			return true;
		}
		case "xbox": {
			return true;
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
