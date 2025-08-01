import Form from "@/components/donate/Form";
import Loader from "@/components/ui/Loader";
import { Suspense } from "react";

export default function Page() {
	return (
		<Suspense fallback={<Loader />}>
			<Form />
		</Suspense>
	);
}
