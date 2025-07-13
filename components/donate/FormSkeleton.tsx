import { ButtonGroup, Card, CardActions, CardContent, FormControl, Skeleton } from "@mui/joy";

export default function FormSkeleton() {
	return (
		<Card sx={{ maxWidth: "sm", mx: "auto", mt: 5 }}>
			<CardContent>
				<FormControl>
					<Skeleton variant="text" height={50}></Skeleton>
				</FormControl>
				<Skeleton variant="text" height={50} width={150}></Skeleton>
				<ButtonGroup sx={{ gap: 3, justifyContent: "center" }}>
					{Array.from({ length: 3 }).map((_, index) => (
						<Skeleton key={index} variant="rectangular" height={25} width={50}></Skeleton>
					))}
				</ButtonGroup>
			</CardContent>
			<CardActions>
				<Skeleton variant="text"></Skeleton>
			</CardActions>
		</Card>
	);
}
