export interface PlatformProps {
	id?: number;
	name: string | "steam" | "ea" | "gog" | "epic" | "ubisoft" | "switch" | "playstation" | "xbox";
	platformTypeId?: number;
	platformType?: PlatformTypeProps | null;
}

export interface RegionProps {
	id?: number;
	name: string;
}

export interface StatusProps {
	id?: number;
	name: string
}

export interface PlatformTypeProps {
	id?: number;
	name: string;
}

export interface DonationProps {
	region: RegionProps;
	discordId?: string;
	platformType: PlatformTypeProps["name"];
	platform: PlatformProps[ "name" ];
}

export interface KeyProps {
	key: string;
	discordId: string;
}

export interface GuildProps {
	name: string;
	id: string;
	icon?: string;
}

export interface SessionProps {
	isMemberOfGuild: boolean;
	guild: { name: string; id: string; icon?: string };
	status?: "authenticated" | "loading" | "unauthenticated"
}

export interface LocationProps {
	name: string;
	href: string;
}

export interface DonationFormErrorProps {
	key?: string;
}

export interface GenericErrorProps {
	generic?: string;
}

export interface ResponseProps {
	status: "success" | "error" | "fail";
	statusCode: 200 | 201 | 400 | 401 | 404 | 409 | 500;
	message?: string;
	errors?: DonationFormErrorProps | GenericErrorProps;
	data?: unknown;
}

export interface DiscordEmbedProps {
	title: string;
	description?: string;
	color?: number;
	thumbnail?: DiscordMediaProps;
	image?: DiscordMediaProps;
	fields?: { name: string; value: string; inline?: boolean }[];
}

export interface DiscordMessageProps {
	content?: string;
	embeds?: DiscordEmbedProps[];
	recipient_id?: string;
}

export interface DiscordMediaProps {
	url: string;
	height?: number;
	width?: number;
	proxy_url?: string;
}

export type PlatformTypes = "pc" | "console";
