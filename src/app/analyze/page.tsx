"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";

type ExtractResult = { origin: string; text: string };

type OCRWorker = {
loadLanguage: (lang: string) => Promise<void>;
initialize: (lang: string) => Promise<void>;
recognize: (source: string | Blob) => Promise<{ data: { text: string } }>;
terminate: () => Promise<void>;
};

export default function AnalyzePage() {
const [results, setResults] = useState<ExtractResult[]>([]);
const [isProcessing, setIsProcessing] = useState(false);
const [error, setError] = useState<string | null>(null);
const inputRef = useRef<HTMLInputElement>(null);

const onPick = useCallback(() => inputRef.current?.click(), []);

const handleFiles = useCallback(async (files: FileList | null) => {
if (!files || files.length === 0) return;
setError(null);
setIsProcessing(true);
const next: ExtractResult[] = [];
try {
for (const file of Array.from(files)) {
if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
const text = await extractFromPdf(file);
next.push({ origin: file.name, text });
} else if (file.type.startsWith("image/") || /\.(png|jpe?g|webp|bmp)$/i.test(file.name)) {
const text = await extractFromImage(file);
next.push({ origin: file.name, text });
} else {
next.push({ origin: file.name, text: "Unsupported file type" });
}
}
setResults(next);
} catch (e: unknown) {
const message = e instanceof Error ? e.message : "Failed to process files";
setError(message);
} finally {
setIsProcessing(false);
}
}, []);

const onPickFolder = useCallback(() => {
const el = document.createElement("input");
el.type = "file";
el.multiple = true;
// @ts-ignore - Chromium-only API
el.webkitdirectory = true;
el.onchange = () => handleFiles(el.files);
el.click();
}, [handleFiles]);

const suggestions = useMemo(() => buildSuggestions(results.map(r => r.text).join("\n\n")), [results]);

return (
<div className="space-y-8 mx-auto max-w-6xl px-4">
<div className="flex items-center justify-between">
<h1 className="text-2xl font-bold">Analyze Content</h1>
<Link href="/" className="text-sm underline">Back</Link>
</div>

<div
className="rounded-2xl border border-dashed border-black/20 dark:border-white/15 p-10 text-center bg-black/[.03] dark:bg-white/[.04] hover:border-black/30 dark:hover:border-white/25 transition"
onDragOver={(e) => e.preventDefault()}
onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
>
<p className="mb-4">Drag and drop PDFs or images here</p>
<div className="flex items-center justify-center gap-3">
<button aria-label="Choose files" className="inline-flex items-center justify-center rounded-lg bg-foreground text-background px-6 h-11 font-medium shadow hover:shadow-lg transition-shadow disabled:opacity-60" onClick={onPick} disabled={isProcessing}>Choose files</button>
<button aria-label="Choose folder" className="inline-flex items-center justify-center rounded-lg border border-black/10 dark:border-white/10 px-6 h-11 font-medium hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-60" onClick={onPickFolder} disabled={isProcessing}>Choose folder</button>
<input ref={inputRef} type="file" accept=".pdf,image/*" multiple className="hidden" onChange={(e) => handleFiles(e.currentTarget.files)} />
</div>
{isProcessing && <p className="mt-4 text-sm text-muted-foreground animate-pulse">Processing… this can take a moment.</p>}
{error && <p className="mt-4 text-sm text-red-600">{error}</p>}
</div>

{results.length > 0 && (
<div className="grid lg:grid-cols-2 gap-6">
<section className="rounded-xl border border-black/10 dark:border-white/10 p-4 overflow-auto max-h-[60vh] bg-black/5 dark:bg-white/5">
<h2 className="font-semibold mb-2">Extracted Text</h2>
{results.map((r) => (
<article key={r.origin} className="mb-6">
<h3 className="text-sm font-medium opacity-70 mb-1">{r.origin}</h3>
<pre className="whitespace-pre-wrap text-sm leading-6">{r.text}</pre>
</article>
))}
</section>
<section className="rounded-xl border border-black/10 dark:border-white/10 p-4 lg:sticky lg:top-6 h-fit bg-black/5 dark:bg-white/5">
<h2 className="font-semibold mb-3">Suggestions</h2>
<ul className="list-disc pl-5 space-y-2 text-sm">
{suggestions.map((s, i) => (<li key={i}>{s}</li>))}
</ul>
</section>
</div>
)}
</div>
);
}

async function extractFromPdf(file: File): Promise<string> {
const pdfjs = (await import("pdfjs-dist")) as unknown as {
GlobalWorkerOptions: { workerSrc: string };
getDocument: (opts: { data: ArrayBuffer }) => { promise: Promise<{
numPages: number;
getPage: (n: number) => Promise<{ getTextContent: () => Promise<{ items: Array<unknown> }> }>;
}> };
};
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
const arrayBuffer = await file.arrayBuffer();
const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
let fullText = "";
for (let i = 1; i <= pdf.numPages; i++) {
const page = await pdf.getPage(i);
const content = await page.getTextContent();
const pageText = content.items.map((it: unknown) => (isTextItem(it) ? it.str : "")).join(" ");
fullText += pageText + "\n";
}
return fullText.trim();
}

async function extractFromImage(file: File): Promise<string> {
const Tesseract = (await import("tesseract.js")).default as {
	recognize: (src: string | Blob, lang: string) => Promise<{ data: { text: string } }>;
};
const { data } = await Tesseract.recognize(URL.createObjectURL(file), "eng");
return (data.text ?? "").trim();
}

function buildSuggestions(text: string): string[] {
if (!text) return ["No text extracted. Try another file."];
const suggestions: string[] = [];
if (text.length > 280) suggestions.push("Shorten the copy for scanability; aim for 120–200 characters.");
if (!/[!?.]$/.test(text.trim())) suggestions.push("End with clear punctuation or a call-to-action.");
if (!/(^|\s)#[\w-]+/.test(text)) suggestions.push("Consider adding 1–3 relevant hashtags.");
if (!/(http|https):\/\//.test(text)) suggestions.push("Add a link or tagged handle if relevant.");
if (!/\n/.test(text)) suggestions.push("Break long text into short lines for readability.");
if (suggestions.length === 0) suggestions.push("Looks good! Consider A/B testing different hooks.");
return suggestions;
}

function isTextItem(item: unknown): item is { str: string } {
return typeof item === "object" && item !== null && "str" in (item as Record<string, unknown>);
}
