import ServerData from "@/components/community/ServerData";
import Loader from "@/components/ui/Loader";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: 'Community',
	description: 'View community details'
}

export default function Page() {
	return (
		<Suspense fallback={<Loader/>}>
			<ServerData />
		</Suspense>
	);
}
