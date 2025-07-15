import { DonationProps, ResponseProps } from "../definitions";
import prisma from "../prisma/prisma";
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
			const createdKey = await prisma.key.create({ data: { key: key } });
			await prisma.donation.create({ data: { keyId: createdKey.id, platformId: +platformId, platformTypeId: +platformTypeId, gameName: gameName, discordId: discordId.toString() } });
			return { status: "success", statusCode: 201, message: "Successfully created donation" } as ResponseProps;
		} catch (error) {
			console.error(error);
			return { status: "error", statusCode: 500, message: "An internal server error has occurred while trying to create a donation" } as ResponseProps;
		}
	}
}
