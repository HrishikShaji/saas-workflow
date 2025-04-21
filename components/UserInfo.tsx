"use client"

import { SignedIn, UserButton } from "@clerk/nextjs"

export default function UserInfo() {
	return <SignedIn>
		<UserButton />
	</SignedIn>

}
