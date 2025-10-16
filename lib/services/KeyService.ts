import { ResponseProps } from "../definitions";
import prisma from "../prisma/prisma";
import { encrypt, generateKeyHash, parseClientPrismaError } from "../utils/server";
export default class KeyService {
	static async create(key: string, platformId: number) {
		try {
			const { encrypted, iv, authTag } = encrypt(key);
			const keyHash = generateKeyHash(key);
			return await prisma.key.create({ data: { key: encrypted.toString("hex"), keyHash: keyHash, platformId: platformId, iv: iv.toString("hex"), authTag: authTag.toString("hex") } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "key");
			throw prismaError ?? { status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while trying to create key" } } as ResponseProps;
		}
	}
	static async getById(id: number) {
		try {
			return await prisma.key.findFirstOrThrow({ where: { id: id }, include: { Platform: true } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "key");
			throw prismaError ?? { status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while trying to retrieve key by id" } } as ResponseProps;
		}
	}
	static async getAll() {
		try {
			return await prisma.key.findMany({ include: { Platform: true } });
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "key");
			throw prismaError ?? { status: "error", statusCode: 500, errors: { generic: "An internal server error has occurred while trying to get all keys" } } as ResponseProps;
		}
	}
}
