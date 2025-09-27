import { ensure_login } from "@/functions/server_functions";
import MakesClient from "./MakesClient";
import AskAi from "@/components/AskAi";
import React from "react";

export default async function MakesComponent({ searchParams }: SearchParams) {
	const resolvedSearchParams = await searchParams;
	const username = (resolvedSearchParams.username as string) || undefined;
	const altUsername = await ensure_login();

	return (
		<div>
			<AskAi />
			<MakesClient username={username} altUsername={altUsername} />
		</div>
	);
}
