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
	name: string;
}

export interface PlatformTypeProps {
	id?: number;
	name: string;
}

export interface DonationProps {
	region: RegionProps;
	discordId?: string;
	platformType: PlatformTypeProps["name"];
	platform: PlatformProps["name"];
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
	status?: "authenticated" | "loading" | "unauthenticated";
}

export interface LocationProps {
	name: string;
	href: string;
}

export interface GiveawayCountProps {
	pcActiveCount: number;
	pcInactiveCount: number;
	consoleActiveCount: number;
	consoleInactiveCount: number;
}

export interface DonationFormErrorProps {
	[key: string]: string;
}

export interface GenericErrorProps {
	[key: string]: string;
}

export interface ResponseProps<T = unknown> {
	status: "success" | "error" | "fail";
	statusCode: 200 | 201 | 400 | 401 | 404 | 409 | 500;
	message?: string;
	errors?: DonationFormErrorProps | GenericErrorProps;
	data?: T;
}

export interface DiscordEmbedProps {
	title: string;
	description?: string;
	color?: number;
	thumbnail?: DiscordMediaProps;
	image?: DiscordMediaProps;
	fields?: { name: string; value: string; inline?: boolean }[];
	footer?: DiscordEmbedFooterProps;
}

export interface DiscordRoleProps {
	id: string;
	name?: string;
}

export interface DiscordEmbedFooterProps {
	text: string;
	icon_url?: string;
	icon_proxy_url?: string;
}

export interface DiscordMessageProps {
	content?: string;
	embeds?: DiscordEmbedProps[];
	recipient_id?: string;
	footer?: DiscordEmbedFooterProps;
}

export interface DiscordMediaProps {
	url: string;
	height?: number;
	width?: number;
	proxy_url?: string;
}

export type PlatformTypes = "pc" | "console";
