"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
	const { theme, setTheme } = useTheme();
	return (
		<header className="sticky top-0 z-40 w-full border-b border-black/10 dark:border-white/10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
				<Link href="/" className="font-semibold tracking-tight">Social Analyzer</Link>
				<nav className="flex items-center gap-4 text-sm">
					<Link className="hover:underline" href="/analyze">Analyze</Link>
					<button
						aria-label="Toggle theme"
						className={cn("inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/10 w-9 h-9", "bg-white/70 dark:bg-black/30 hover:bg-white dark:hover:bg-black")}
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
					>
						<Sun className="h-4 w-4 dark:hidden" />
						<Moon className="h-4 w-4 hidden dark:block" />
					</button>
				</nav>
			</div>
		</header>
	);
}

"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
	const { theme, setTheme } = useTheme();

	return (
		<header className="sticky top-0 z-40 w-full border-b border-black/10 dark:border-white/10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
				<Link href="/" className="font-semibold tracking-tight">
					Daffodils Analyzer
				</Link>
				<nav className="flex items-center gap-4 text-sm">
					<Link className="hover:underline" href="/analyze">Analyze</Link>
					<button
						aria-label="Toggle theme"
						className={cn(
							"inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/10 w-9 h-9",
							"bg-white/70 dark:bg-black/30 hover:bg-white dark:hover:bg-black"
						)}
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
					>
						<Sun className="h-4 w-4 dark:hidden" />
						<Moon className="h-4 w-4 hidden dark:block" />
					</button>
				</nav>
			</div>
		</header>
	);
}


