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

export type DonationFormErrorTypes = {
	key?: string;
	gameName?: string;
};

export type ResponseProps = {
	status: "success" | "error" | "fail";
	statusCode: 200 | 201 | 400 | 401 | 404 | 409 | 500;
	message?: string;
	errors?: DonationFormErrorTypes;
	data?: unknown;
};

export type PlatformTypes = "pc" | "console";