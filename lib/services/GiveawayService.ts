import { PlatformTypeProps, ResponseProps } from "../definitions";
import prisma from "../prisma/prisma";
import { getGiveawayDurationInDateTime, parseClientPrismaError } from "../utils";
import DiscordService from "./DiscordService";
import DontationService from "./DonationService";

export default class GiveawayService {
	static async create(donationId: number) {
		try {
			const status = await prisma.status.findFirstOrThrow({ where: { name: "active" } });
			const deadline = getGiveawayDurationInDateTime(2);
			const giveaway = await prisma.giveaway.create({ data: { statusId: status.id, duration: deadline } });
			await DontationService.assignGiveawayId(donationId, giveaway.id);
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
			return await prisma.giveaway.findFirstOrThrow({ where: { id: id } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "giveaway");
			throw prismaError ?? ({ status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while trying to get giveaway by id" } } as ResponseProps);
		}
	}
	static async getByMessageId(discordMessageId: string) {
		try {
			return await prisma.giveaway.findFirst({ where: { messageId: discordMessageId } });
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
			const donations = await DontationService.getByPlatformType(platformType);
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
}
