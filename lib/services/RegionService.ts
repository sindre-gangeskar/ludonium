import prisma from "../prisma/prisma";
export default class RegionService {
	static async getAll() {
		try {
			return await prisma.region.findMany();
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}
