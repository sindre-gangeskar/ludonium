"use server"
import PlatformService from "@/lib/services/PlatformService";
import { PlatformProps } from "@/lib/definitions";

export async function getAllPlatforms(): Promise<Array<PlatformProps>> {
  return await PlatformService.getAll();
}