import { ResponseProps } from "../definitions";
import prisma from "../prisma/prisma";
import { parseClientPrismaError } from "../utils";
export default class PlatformService {
	static async getAll() {
		try {
			return await prisma.platform.findMany({ include: { platformType: true } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "platform");
			throw prismaError ?? ({ status: "error", statusCode: 500, data: [], errors: { generic: "An internal server error has occurred while trying to retrieve platforms" } } as ResponseProps);
		}
	}
}
