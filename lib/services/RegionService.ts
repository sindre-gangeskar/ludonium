import { ResponseProps } from "../definitions";
import prisma from "../prisma/prisma";
import { parseClientPrismaError } from "../utils";
export default class RegionService {
	static async getAll(order?: "asc" | "desc") {
		try {
			return await prisma.region.findMany({ orderBy: { id: order ?? "asc" } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "region");
			throw prismaError ?? ({ status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while trying to get regions" } } as ResponseProps);
		}
	}
}
