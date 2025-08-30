import Link from "next/link";
import { FileText, Sparkles, Palette } from "lucide-react";

export default function Home() {
  return (
    <section className="text-center space-y-10 pt-16 sm:pt-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.15] sm:leading-[1.1] bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400">
          Social Media Content Analyzer
        </h1>
        <p className="mt-6 sm:mt-8 text-muted-foreground max-w-2xl mx-auto">
          Upload PDFs or images of your social posts. We’ll extract the text and provide tips to boost engagement.
        </p>
      </div>
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/analyze"
          className="inline-flex items-center justify-center rounded-lg bg-foreground text-background px-6 h-11 font-medium shadow hover:shadow-lg transition-shadow"
        >
          Get started
        </Link>
        <a
          href="https://nextjs.org"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-lg border border-black/10 dark:border-white/10 px-6 h-11 font-medium hover:bg-black/5 dark:hover:bg-white/5"
        >
          Docs
        </a>
      </div>
      <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto mt-4">
        <Feature title="Smart extraction" description="PDF parsing + OCR for images" Icon={FileText} />
        <Feature title="Insightful tips" description="Tone, clarity, and hashtags" Icon={Sparkles} />
        <Feature title="Beautiful UI" description="Responsive, dark mode ready" Icon={Palette} />
      </div>
    </section>
  );
}

function Feature({ title, description, Icon }: { title: string; description: string; Icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 text-left bg-black/5 dark:bg-white/5">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="h-5 w-5 opacity-80" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
