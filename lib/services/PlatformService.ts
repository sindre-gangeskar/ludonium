import prisma from "../prisma/prisma";
export default class PlatformService {
	static async getAll() {
		try {
			return await prisma.platform.findMany({ include: { platformType: true } });
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}
