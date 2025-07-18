import { ResponseProps } from "../definitions";
import prisma from "../prisma/prisma";
import { parseClientPrismaError } from "../utils";
export default class KeyService {
	static async create(key: string) {
		try {
			return await prisma.key.create({ data: { key: key.toLowerCase() } });
		} catch (error) {
      console.error(error);
			const prismaError = parseClientPrismaError(error, "key");
			if (prismaError) throw { status: "fail", statusCode: 409, errors: { key: prismaError.message } } as ResponseProps;
			throw error;
		}
	}
}
