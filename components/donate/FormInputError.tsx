"use client";
import { Typography } from "@mui/joy";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
export default function FormInputError({ children }: { children: React.ReactNode }) {
	useGSAP(() => {
		gsap.set(".state-message", { opacity: 0, margin: 0 });
		gsap.to(".state-message", { opacity: 1, duration: 2, ease: "power4.out" });
	});
	return (
		<Typography className="state-message" sx={{ p: 1 }} color="danger" level="title-md">
			{children}
		</Typography>
	);
}
