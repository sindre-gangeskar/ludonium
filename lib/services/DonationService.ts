import { DonationProps, PlatformProps, ResponseProps } from "../definitions";
import prisma from "../prisma/prisma";
import { isKeyValid } from "../utils";
export default class DontationService {
	static async getDonations(discordId: string) {
		try {
			return (await prisma.donation.findMany({ where: { discordId: discordId }, include: { platform: true, platformType: true } })).map(donation => ({
				gameName: donation.gameName,
				platform: donation?.platform?.name,
				platformType: donation?.platformType?.name,
			})) as DonationProps[];
		} catch (error) {
			console.error(error);
			return { status: "error", statusCode: 500, message: "An internal server error has occurred while trying to get donations" } as ResponseProps;
		}
	}

	static async createDonation(discordId: string, key: string, gameName: string, platformTypeId: number, platformId: number) {
		try {
			const platform = await prisma.platform.findFirst({ where: { id: platformId } });
			if (!platform) throw new Error("Failed to find platform with provided id");

			if (!isKeyValid(platform.name as PlatformProps["name"], key)) {
				const upperCase = platform.name[0].toUpperCase();
				const lowercase = platform.name.slice(1, platform.name.length);
				const name = upperCase + lowercase;
				return {
					status: "fail",
					statusCode: 400,
					message: `Invalid ${name} key format`,
					errorType: "key",
				} as ResponseProps;
			}

			const createdKey = await prisma.key.create({ data: { key: key.toLowerCase() } });
			await prisma.donation.create({ data: { keyId: createdKey.id, platformId: +platformId, platformTypeId: +platformTypeId, gameName: gameName, discordId: discordId.toString() } });
			return { status: "success", statusCode: 201, message: "Successfully created donation" } as ResponseProps;
		} catch (error) {
			console.error(error);
			return { status: "error", statusCode: 500, message: "An internal server error has occurred while trying to create a donation" } as ResponseProps;
		}
	}
}
