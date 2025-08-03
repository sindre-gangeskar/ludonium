import { ResponseProps } from "../definitions";
import prisma from "../prisma/prisma";
import { isGiveawayExpired, parseClientPrismaError } from "../utils";
import GiveawayService from "./GiveawayService";

export default class ParticipantService {
	static async create(giveawayId: number, discordId: string) {
		try {
			const giveaway = await GiveawayService.getById(giveawayId);

			if (giveaway && (giveaway.status.name === "active" && !isGiveawayExpired(giveaway.duration))) {
				return await prisma.participant.upsert({
					where: { discordId_giveawayId: { discordId, giveawayId } },
					update: { giveawayId: giveawayId, discordId: discordId },
					create: { giveawayId: giveawayId, discordId: discordId },
				});
			} else return null;
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "participant");
			throw prismaError ?? ({ status: "error", statusCode: 500, data: [], errors: { generic: "An internal server error has occurred while trying to create participant" } } as ResponseProps);
		}
	}
	static async getByGiveawayId(giveawayId: number) {
		try {
			return await prisma.participant.findMany({ where: { giveawayId: giveawayId } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "participant");
			throw (
				prismaError ?? ({ status: "error", statusCode: 500, data: [], errors: { generic: "An internal server error has occurred while trying to retrieve participants by giveaway id" } } as ResponseProps)
			);
		}
	}
	static async delete(giveawayId: number, discordId: string) {
		try {
			const giveaway = await GiveawayService.getById(giveawayId);
			const participant = await prisma.participant.findFirst({ where: { discordId, giveawayId } });
			if (participant && giveaway) return await prisma.participant.delete({ where: { discordId_giveawayId: { giveawayId: giveaway.id, discordId } } });
			else return null;
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "participant");
			throw prismaError ?? ({ status: "error", statusCode: 500, data: [], errors: { generic: "An internal server error has occurred while trying to delete participant" } } as ResponseProps);
		}
	}
}
