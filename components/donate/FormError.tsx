"use client";
import { ResponseProps } from "@/lib/definitions";
import { useGSAP } from "@gsap/react";
import { Card, CardContent, Typography } from "@mui/joy";
import { TypographyProps } from "@mui/joy";
import gsap from "gsap";
export default function FormError({ state }: { state: ResponseProps }) {
	useGSAP(() => {
		gsap.set("#error", { opacity: 0, y: -80 });
		gsap.to("#error", { opacity: 1, y: 0, duration: 1.2, ease: "back.out" });
	});
	const titleTypographyProps: TypographyProps = { textAlign: "center", level: "title-lg" };

	return (
		<Card size="lg" id="error" color="danger" variant="solid" sx={{ maxWidth: "sm", mx: "auto", my: 5 }}>
			<CardContent>
				{state.status === "error" && (
					<>
						<Typography {...titleTypographyProps}>Uh oh! Something unexpected has occurred</Typography>
						{state.status === "error" && state?.message && <Typography textAlign={"center"}>{state.message}</Typography>}
					</>
				)}

				{state.status === "fail" && state?.errors?.discordMembership && <Typography {...titleTypographyProps}>{state.errors.discordMembership}</Typography>}
			</CardContent>
		</Card>
	);
}
