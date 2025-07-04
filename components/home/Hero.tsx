import { Card, Typography } from "@mui/joy";

export default function Hero() {
	return (
		<Card variant="plain" component={"section"} id="hero" sx={{ maxWidth: "md", mx: 'auto', my: 5 }}>
      <Typography level="h1">Welcome</Typography>
      <Typography>A way to give back to the community</Typography>
		</Card>
	);
}
