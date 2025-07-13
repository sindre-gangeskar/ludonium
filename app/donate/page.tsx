import Form from "@/components/donate/Form";
import FormSkeleton from "@/components/donate/FormSkeleton";
import { Suspense } from "react";

export default function Page() {
	return (
		<Suspense fallback={<FormSkeleton />}>
			<Form />
		</Suspense>
	);
}
