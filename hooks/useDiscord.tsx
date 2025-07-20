"use client"
import useSWR from "swr";

export default function useDiscord() {
	const fetcher = () => fetch("/api/discord").then(res => res.json());
	const { data, error, isLoading } = useSWR("/api/discord", fetcher);
	return { data, error, isLoading };
}
