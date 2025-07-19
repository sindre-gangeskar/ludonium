import { ResponseProps } from "../definitions";
import prisma from "../prisma/prisma";
import { decrypt, encrypt, generateKeyHash, parseClientPrismaError } from "../utils";
export default class KeyService {
	static async create(key: string, platformId: number) {
		try {
			const { encrypted, iv, authTag } = encrypt(key);
			const keyHash = generateKeyHash(key);
			const createdKey = await prisma.key.create({ data: { key: encrypted.toString('hex'),keyHash: keyHash, platformId: platformId, iv: iv.toString("hex"), authTag: authTag.toString("hex") } });
			const decryptedKey = decrypt(createdKey.key, createdKey.iv, createdKey.authTag);
			
			console.info("DECRYPTED KEY: ", decryptedKey);
			return createdKey;
		} catch (error) {
			console.error(error);
			const prismaError = parseClientPrismaError(error, "key");
			if (prismaError) throw { status: "fail", statusCode: 409, errors: { key: prismaError.message } } as ResponseProps;
			throw error;
		}
	}
	static async getKey(id: number) {
		try {
			const key = await prisma.key.findFirst({ where: { id: id } });
			if (key) {
				const decrypted = decrypt(key.key, key.iv, key.authTag);
				return decrypted;
			} else return null;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}
