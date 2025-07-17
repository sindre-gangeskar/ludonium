import { Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

export default function Header({ id, className, title, description }: { id?: string; className?: string; title: string; description?: string }) {
  const textSx: SxProps = {textShadow: "0px 0px 10px  #00000024", color: "white", p: 0, m: 0}
	return (
		<Stack id={id} className={className} gap={3} direction={"column"} sx={{ maxWidth: "lg", mx: "auto", textAlign: "center", my: 5, }}>
			<Typography level="h1" sx={{ my: 4, ...textSx }}>
				{title}
			</Typography>
			{description && <Typography sx={{...textSx}} level="title-lg">{description}</Typography>}
		</Stack>
	);
}
