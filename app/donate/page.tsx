import Form from "@/components/donate/Form";
import Loader from "@/components/ui/Loader";
import { Metadata } from "next";
import { Suspense } from "react";
export const metadata: Metadata = {
	title: 'Donate', 
	description: 'Donate game keys to the community'
}
export default function Page() {
	return (
		<Suspense fallback={<Loader />}>
			<Form />
		</Suspense>
	);
}
