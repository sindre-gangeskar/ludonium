import prisma from "../prisma/prisma";
import DiscordService from "./DiscordService";
import DonationService from "./DonationService";
import { MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import { PlatformTypeProps, ResponseProps, StatusProps } from "../definitions";
import { getGiveawayDurationInDateTime, isGiveawayExpired, parseClientPrismaError } from "../utils/server";
import { getDiscordVariables } from "../utils/server";
const { giveawayDuration } = getDiscordVariables();
export default class GiveawayService {
	static async create(donationId: number) {
		try {
			const status = await prisma.status.findFirstOrThrow({ where: { name: "active" } });
			const duration = getGiveawayDurationInDateTime(+giveawayDuration || 2);
			const giveaway = await prisma.giveaway.create({ data: { statusId: status.id, duration: duration } });
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
	static async getAllExpiredGiveawaysWithParticipants() {
		try {
			return await prisma.giveaway.findMany({
				where: { status: { name: "active" }, duration: { lt: new Date() }, messageId: { not: null }, winnerDiscordId: null, participant: { some: {} } },
			});
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "giveaways");
			throw prismaError ?? ({ status: "error", statusCode: 500, message: "An internal server error has occurred while trying to retrieve all active giveaways" } as ResponseProps);
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
			return await prisma.giveaway.update({ where: { id }, data: { winnerDiscordId: winnerDiscordId, messageId: messageId } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "giveaway");
			throw prismaError ?? ({ status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while trying to update giveaway" } } as ResponseProps);
		}
	}
	static async createRandomGiveaway(platformType: PlatformTypeProps[ "name" ]) {
		try {
			const donations = await DonationService.getByPlatformType(platformType);
			if (donations.length > 0) {
				const randomSelection = Math.floor(Math.random() * donations.length);
				await DiscordService.createGiveaway(donations[ randomSelection ].id);
				return { status: "success", statusCode: 200, message: "Successfully created giveaway" } as ResponseProps;
			} else
				throw {
					status: "fail",
					statusCode: 404,
					errors: { [ platformType ]: `Could not create ${platformType} giveaway - no available donations found` },
				} as ResponseProps;
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "giveaways");
			const parsedError = error as ResponseProps;
			if (parsedError.statusCode === 404) throw parsedError;
			throw (
				prismaError ??
				({
					status: "error",
					statusCode: 500,
					errors: {
						[ platformType ]: `An internal server error has occurred while trying to create random ${platformType} giveaway`,
						errors: { [ platformType ]: "An internal server error has occurred while trying to create a random giveaway" },
					},
				} as ResponseProps)
			);
		}
	}
	static async assignGiveawayWinner(giveawayId: number) {
		try {
			return await prisma.$transaction(async tx => {
				const giveaway = await tx.giveaway.findFirstOrThrow({ where: { id: giveawayId, participant: { some: {} }, winnerDiscordId: null } });

				const pCount = await tx.participant.count({ where: { giveawayId: giveaway.id } });
				if (pCount === 0) return null;

				const offset = Math.floor(Math.random() * pCount);

				const [ winner ] = await tx.participant.findMany({ where: { giveawayId }, orderBy: { id: "asc" }, skip: offset, take: 1 });
				if (!winner) return null;

				const updated = await tx.giveaway.update({ data: { winnerDiscordId: winner.discordId }, where: { id: giveawayId, winnerDiscordId: null } });
				return updated;
			});
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "giveaways");
			throw prismaError ?? ({ status: "error", statusCode: 500, message: "An internal server error has occurred while trying to assign a winner to giveaway" } as ResponseProps);
		}
	}
	static async checkGiveaways() {
		try {
			const giveaways = await this.getAllExpiredGiveawaysWithParticipants();

			for (const giveaway of giveaways) {
				try {
					/* Assign winner ID to giveaway - skip iteration if nothing is returned or if it's lacking a winnerDiscordId */
					const winner = (await this.assignGiveawayWinner(giveaway.id)) as { winnerDiscordId: string };
					if (!winner || !winner.winnerDiscordId) continue;

					/* Retrieve the associated donation and the game key */
					const donation = await DonationService.getByGiveawayId(giveaway.id);
					const key = donation.key;

					const { data }: { data: ResponseProps } = await DiscordService.sendGiveawayWinDM(winner.winnerDiscordId, key.id, donation.platform.name, donation.region.name, giveaway.id);

					if (data.status === "error" || data.status === "fail") continue;

					await GiveawayService.setGiveawayStatus(giveaway.id, "success", "Winner DM sent");
				} catch (error) {
					console.error(error);
					continue;
				}
			}
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "giveaways");
			throw prismaError ?? ({ status: "error", statusCode: 500, message: "An internal server error has occurred while trying to check giveaways" } as ResponseProps);
		}
	}
	static async setGiveawayStatus(id: number, statusName: StatusProps[ "name" ], giveawayLog: string) {
		try {
			return await prisma.$transaction(async tx => {
				const giveaway = await tx.giveaway.findUniqueOrThrow({ where: { id: id } });
				const status = await tx.status.findUniqueOrThrow({ where: { name: statusName } });
				await tx.giveawayLog.create({ data: { log: giveawayLog, giveawayId: giveaway.id } });
				return await tx.giveaway.update({ data: { statusId: status.id }, where: { id: id } });
			});
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "giveaways");
			throw prismaError ?? ({ status: "error", statusCode: 500, message: "An internal server error has occurred while trying to assign giveaway a status" } as ResponseProps);
		}
	}
	static async addParticipant(discordMessageId: string, user: User | PartialUser, reaction: MessageReaction | PartialMessageReaction) {
		try {
			return await prisma.$transaction(async tx => {
				const giveaway = await tx.giveaway.findFirst({ where: { messageId: discordMessageId } });
				if (giveaway && !isGiveawayExpired(giveaway.duration))
					await tx.participant.upsert({ where: { discordId_giveawayId: { discordId: user.id, giveawayId: giveaway.id } }, create: { discordId: user.id, giveawayId: giveaway.id }, update: { discordId: user.id, giveawayId: giveaway.id } })
				else await reaction.users.remove(user.id);
			})
		} catch (error) {
			const prismaError = parseClientPrismaError(error, 'Giveaway | Participant');
			console.error(prismaError ?? error);
			throw prismaError ?? { status: "error", statusCode: 500, message: 'An internal server error has occured while trying to add a participant' } as ResponseProps
		}
	}
}