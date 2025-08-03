import { PlatformTypeProps, ResponseProps } from "../definitions";
import prisma from "../prisma/prisma";
import { decrypt, getGiveawayDurationInDateTime, parseClientPrismaError } from "../utils";
import DiscordService from "./DiscordService";
import DonationService from "./DonationService";
import ParticipantService from "./ParticipantService";
import axios from "axios";
import { isGiveawayExpired } from "../utils";
const giveawayChannelId = process.env.DISCORD_GIVEAWAY_CHANNEL_ID;
if (!giveawayChannelId) throw new Error("Missing DISCORD_GIVEAWAY_CHANNEL_ID environment variable");

const serverURL = process.env.DISCORD_SERVER_URL;
if (!serverURL) throw new Error("Missing DISCORD_SERVER_URL environment variable");

const customGiveawayDuration = process.env.DISCORD_GIVEAWAY_DURATION;

export default class GiveawayService {
	static async create(donationId: number) {
		try {
			const status = await prisma.status.findFirstOrThrow({ where: { name: "active" } });
			const deadline = getGiveawayDurationInDateTime(customGiveawayDuration ? +customGiveawayDuration : 2);
			const giveaway = await prisma.giveaway.create({ data: { statusId: status.id, duration: deadline } });
			await DonationService.assignGiveawayId(donationId, giveaway.id);
			return giveaway;
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "giveaway");
			throw prismaError ?? ({ status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while trying to create giveaway" } } as ResponseProps);
		}
	}
	static async getAll() {
		try {
			return await prisma.giveaway.findMany();
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "giveaway");
			throw prismaError ?? ({ status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while trying to get all giveaways" } } as ResponseProps);
		}
	}
	static async getById(id: number) {
		try {
			return await prisma.giveaway.findFirstOrThrow({ where: { id: id }, include: { status: true } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "giveaway");
			throw prismaError ?? ({ status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while trying to get giveaway by id" } } as ResponseProps);
		}
	}
	static async getByMessageId(discordMessageId: string) {
		try {
			return await prisma.giveaway.findFirst({ where: { messageId: discordMessageId }, include: { status: true } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "giveaway");
			throw prismaError ?? ({ status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while retrieving giveaway by discord message id" } } as ResponseProps);
		}
	}
	static async updateById(id: number, messageId?: string, winnerDiscordId?: string) {
		try {
			return await prisma.giveaway.update({ where: { id: id }, data: { messageId: messageId, winnerDiscordId: winnerDiscordId } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "giveaway");
			throw prismaError ?? ({ status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while trying to update giveaway" } } as ResponseProps);
		}
	}
	static async softDelete(id: number) {
		try {
			const status = await prisma.status.findFirstOrThrow({ where: { name: "inactive" } });
			return await prisma.giveaway.update({ where: { id: id }, data: { statusId: status.id } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "giveaway");
			throw prismaError ?? ({ status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while trying to soft delete giveaway" } } as ResponseProps);
		}
	}
	static async createRandomGiveaway(platformType: PlatformTypeProps["name"]) {
		try {
			const donations = await DonationService.getByPlatformType(platformType);
			if (donations.length > 0) {
				const randomSelection = Math.floor(Math.random() * donations.length);
				await DiscordService.createGiveaway(donations[randomSelection].id);
				return { status: "success", statusCode: 200, message: "Successfully created giveaway" } as ResponseProps;
			}
			return {
				status: "fail",
				statusCode: 404,
				errors: { [platformType]: `Could not create ${platformType} giveaway - no available donations found` },
			} as ResponseProps;
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "giveaways");
			throw (
				prismaError ?? ({ status: "error", statusCode: 500, errors: { [platformType]: `An internal server error has occurred while trying to create random ${platformType} giveaway` } } as ResponseProps)
			);
		}
	}
	static async checkGiveaways() {
		try {
			const giveaways = await this.getAll();

			for (const giveaway of giveaways) {
				if (!giveaway.messageId) continue;

				const participants = await ParticipantService.getByGiveawayId(giveaway.id);

				if (participants.length > 0 && isGiveawayExpired(giveaway.duration) && !giveaway.winnerDiscordId) {
					const response = await axios.get(`${serverURL}/get-winner/${giveaway.id}`);
					const body = response.data;

					/* Assign winner ID to giveaway */
					await this.updateById(giveaway.id, giveaway.messageId?.toString(), body.data.user.id);

					/* Retrieve the associated donation and the game key */
					const donation = await DonationService.getByGiveawayId(giveaway.id);
					const key = donation?.key;

					if (key && key.key && body.data.user.id) {
						const decrypted = decrypt(key.key, key.iv, key.authTag);
						await DiscordService.sendGiveawayWinDM(body.data.user.id, decrypted, donation.platform.name, donation.region.name);
						this.softDelete(giveaway.id);
					} else throw new Error("Failed to send giveaway winner a direct message, please check console logs");
				}
			}
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "giveaways");
			throw prismaError ?? ({ status: "error", statusCode: 500, message: "An internal server error has occurred while trying to check giveaways" } as ResponseProps);
		}
	}
}
