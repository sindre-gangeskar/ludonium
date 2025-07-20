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

export interface PlatformTypeProps {
	id?: number;
	name: string;
}

export interface DonationProps {
	region: { id: number; name: string };
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
	fields?: { name: string; value: string; inline: boolean }[];
}

export interface DiscordMessageProps {
	content?: string;
	embeds?: DiscordEmbedProps[];
	recipient_id?: string;
}

export type DiscordAPIRequest =
	| { intent: "channel"; channelId: string; body: DiscordMessageProps }
	| { intent: "guild"; guildId: string }
	| { intent: "create-dm-channel"; recipient_id: string; };

export type PlatformTypes = "pc" | "console";
