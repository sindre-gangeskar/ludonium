import { getAvailableDonationsCount } from "@/app/admin/dashboard/actions";
import DashboardDisplay from "./DashboardDisplay";
export default async function DashboardData() {
	const { data } = await getAvailableDonationsCount();
	if (data && typeof data === "object" && "pc" in data) {
		return <DashboardDisplay count={{ pc: data.pc, console: data.console }} />;
	}
}
