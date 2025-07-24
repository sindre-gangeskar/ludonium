import { ResponseProps } from "../definitions";
import prisma from "../prisma/prisma";
import { parseClientPrismaError } from "../utils";

export default class ParticipantService {
	static async create(giveawayId: number, discordId: string) {
		try {
			return await prisma.participant.upsert({
				where: { discordId_giveawayId: { discordId, giveawayId } },
				update: { giveawayId: giveawayId, discordId: discordId },
				create: { giveawayId: giveawayId, discordId: discordId },
			});
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "participant");
			throw prismaError ?? ({ status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while trying to create participant" } } as ResponseProps);
		}
	}
	static async getByGiveawayId(giveawayId: number) {
		try {
			return await prisma.participant.findMany({ where: { giveawayId: giveawayId } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "participant");
			throw prismaError ?? ({ status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while trying to retrieve participants by giveaway id" } } as ResponseProps);
		}
	}
}
