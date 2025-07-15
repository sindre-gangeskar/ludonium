import { ColorPaletteProp } from "@mui/joy/styles/types";
export interface PlatformProps {
	id?: number;
	name: string | "steam" | "ea" | "gog" | "epic" | "ubisoft" | "switch" | "playstation" | "xbox";
	platformTypeId?: number;
	platformType?: PlatformTypeProps | null;
}

export interface PlatformTypeProps {
	id?: number;
	name: string;
}

export interface DonationProps {
	gameName: string;
	discordId?: string;
	platformType: PlatformTypeProps["name"];
	platform: PlatformProps["name"];
}

export interface Key {
	key: string;
	discordId: string;
}

export interface BackgroundProps {
	style?: "circle" | "ellipsis";
	gridSize?: 20 | 40 | 60 | 80;
	color?: ColorPaletteProp;
	maskSize?: 20 | 40 | 60 | 80 | 100;
	dotSize?: number;
}

export interface GuildProps {
	name: string;
	id: string;
	icon?: string;
}

export interface SessionProps {
	isMemberOfGuild: boolean;
	guild: { name: string; id: string; icon?: string };
}

export interface LocationProps {
	name: string;
	href: string;
}

export interface ResponseProps {
	status: "success" | "error" | "fail";
	statusCode: 200 | 201 | 400 | 401 | 409 | 500;
	message?: string;
	data?: unknown;
}

export type PlatformTypes = "pc" | "console";
