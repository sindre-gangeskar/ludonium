"use client"
import { useGSAP } from "@gsap/react";
import { Card, CardContent, CircularProgress } from "@mui/joy";
import gsap from 'gsap';
export default function Loader() {
  useGSAP(() => {
    gsap.set('#loader', {opacity: 0})
    gsap.to('#loader', {opacity: 1, duration: 0.6, ease: 'power1.out'})
  })
  return (
		<Card variant="soft" id="loader" sx={{mx: "auto", justifyContent: "center", alignContent: "center", alignItems: "center", mt: 15, maxWidth: "sm", height: "250px", background: 'transparent' }}>
			<CardContent>
				<CircularProgress sx={{ my: "auto" }} variant="solid" value={8} color="secondary" size="lg"></CircularProgress>
			</CardContent>
		</Card>
	);
}
