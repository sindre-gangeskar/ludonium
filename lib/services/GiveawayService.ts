import { ResponseProps } from "../definitions";
import prisma from "../prisma/prisma";
import { getGiveawayDurationInDateTime, parseClientPrismaError } from "../utils";
import DontationService from "./DonationService";

export default class GiveawayService {
	static async create(donationId: number) {
		try {
			const status = await prisma.status.findFirstOrThrow({ where: { name: "active" } });
			const donation = await DontationService.getById(donationId);
			const deadline = getGiveawayDurationInDateTime(2);
			return await prisma.giveaway.create({ data: { donationId: donation.id, statusId: status.id, duration: deadline } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "giveaway");
			throw prismaError ?? {status: "error", statusCode: 500, errors: {generic: 'An internal server error has occurred while trying to create giveaway'}} as ResponseProps
		}
	}
	static async getAll() {
		try {
			return await prisma.giveaway.findMany();
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "giveaway");
			throw prismaError ?? { status: "error", statusCode: 500, errors: {generic: 'An internal server error has occurred while trying to get all giveaways'} } as ResponseProps
		}
	}
	static async getById(id: number) {
		try {
			return await prisma.giveaway.findFirst({ where: { id: id } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "giveaway");
			throw prismaError ?? {status: "error", statusCode: 500, errors: {generic: 'An internal server error has occurred while trying to get giveaway by id'}} as ResponseProps
		}
	}
	static async getByMessageId(discordMessageId: string) {
		try {
			return await prisma.giveaway.findFirst({ where: { messageId: discordMessageId } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, 'giveaway');
			throw prismaError ?? {status: "error", statusCode: 500, errors: {generic: 'An internal server error has occurred while retrieving giveaway by discord message id'}} as ResponseProps
		}
	}
	static async updateById(id: number, messageId?: string, winnerDiscordId?: string) {
		try {
			return await prisma.giveaway.update({ where: { id: id }, data: { messageId: messageId, winnerDiscordId: winnerDiscordId } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "giveaway");
			throw prismaError ?? {status: "error", statusCode: 500, errors: {generic: 'An internal server error has occurred while trying to update giveaway'}} as ResponseProps
		}
	}
	static async softDelete(id: number) {
		try {
			const status = await prisma.status.findFirstOrThrow({ where: { name: "inactive" } });
			return await prisma.giveaway.update({ where: { id: id }, data: { statusId: status.id } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "giveaway");
			throw prismaError ?? {status: "error", statusCode: 500, errors: {generic: 'An internal server error has occurred while trying to soft delete giveaway'}} as ResponseProps
		}
	}
}
