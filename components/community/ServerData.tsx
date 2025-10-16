import ServerDisplay from "./ServerDisplay";
import { getDiscordServerInfo } from "@/app/community/actions";
export default async function ServerData() {
	const serverInfo = await getDiscordServerInfo();
	return <ServerDisplay data={serverInfo} />;
}
