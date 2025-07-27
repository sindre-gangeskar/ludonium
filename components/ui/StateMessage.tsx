"use client";
import { useGSAP } from "@gsap/react";
import { ResponseProps } from "@/lib/definitions";
import { Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import gsap from "gsap";

export default function StateMessage({ state, errorKey, prioritize }: { state: ResponseProps | null; errorKey: string; prioritize: ResponseProps["status"][] }) {
	const textSx: SxProps = { textAlign: "center", my: 1 };

	useGSAP(() => {
		if (state && state.status) {
			gsap.set(`.error, .success`, { opacity: 0, height: 0 });
			gsap.to(`.error, .success`, { opacity: 1, height: "auto", duration: 0.8, ease: "expo.out" });
		}
	}, [state]);

	if (state && state.status) {
		if ((prioritize.includes("error") || prioritize.includes("fail")) && state.errors && state.errors[errorKey])
			return (
				<Typography className="error" level="title-sm" color="danger" sx={{ ...textSx }}>
					{state.errors[errorKey]}
				</Typography>
			);
		else if (prioritize.includes("success") && state.message)
			return (
				<Typography className="success" level="title-sm" color="success" sx={{ ...textSx }}>
					{state.message}
				</Typography>
			);
	}
}
