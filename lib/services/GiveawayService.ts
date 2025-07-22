import prisma from "../prisma/prisma";

export default class GiveawayService {
	static async getAll() {
		try {
			return await prisma.giveaway.findMany();
		} catch (error) {
			console.error(error);
		}
	}
	static async getById(id: number) {
		try {
			return await prisma.giveaway.findFirstOrThrow({ where: { id: id } });
		} catch (error) {
			console.error(error);
		}
	}
	static async updateById(id: number, messageId?: string, winnerDiscordId?: string) {
		try {
			return await prisma.giveaway.update({ where: { id: id }, data: { messageId: messageId, winnerDiscordId: winnerDiscordId } });
		} catch (error) {
			console.error(error);
		}
	}
	static async softDelete(id: number) {
		try {
			const status = await prisma.status.findFirstOrThrow({ where: { name: "inactive" } });
			return await prisma.giveaway.update({ where: { id: id }, data: { statusId: status.id } });
		} catch (error) {
			console.error(error);
		}
	}
}
