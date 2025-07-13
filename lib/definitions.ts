import { ColorPaletteProp } from "@mui/joy/styles/types";
export interface PlatformProps {
	id?: number
	name: string;
	platformTypeId: number
	platformType?: PlatformTypeProps
}

export interface PlatformTypeProps{
	id?: number,
	name: string
}

export interface Key {
	key: string;
	discordId: string;
}

export interface BackgroundProps {
	style?: "circle" | "ellipsis";
	gridSize?: 20 | 40 | 60 | 80;
	color?: ColorPaletteProp;
	maskSize?: 20 | 40 | 60 | 80 | 100,
	dotSize?: number
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
