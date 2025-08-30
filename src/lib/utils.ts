import type { ClassValue } from "clsx";

function clsxLike(...classes: ClassValue[]): string {
	return classes.filter(Boolean).map(String).join(" ");
}

export function cn(...inputs: ClassValue[]): string {
	return clsxLike(...inputs);
}

export function truncate(text: string, max = 300): string {
	if (text.length <= max) return text;
	return text.slice(0, max - 1) + "…";
}

import type { ClassValue } from "clsx";

function clsxLike(...classes: ClassValue[]): string {
	return classes.filter(Boolean).map(String).join(" ");
}

export function cn(...inputs: ClassValue[]): string {
	return clsxLike(...inputs);
}

export function formatNumber(num: number): string {
	return new Intl.NumberFormat(undefined).format(num);
}

export function truncate(text: string, max = 300): string {
	if (text.length <= max) return text;
	return text.slice(0, max - 1) + "…";
}


