import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Trash2, FileText, FileDown, Sun, Moon, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { convert, type ConvertMode } from "@/lib/converter";
import { exportDocx } from "@/lib/docx-export";
import { useTheme } from "@/components/theme-provider";
import { TypingGuide } from "@/components/typing-guide";

const MODE_KEY = "spsinhalish-mode";

function countWords(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ConvertMode>(() => {
    if (typeof window === "undefined") return "unicode";
    const stored = window.localStorage.getItem(MODE_KEY);
    return stored === "legacy" ? "legacy" : "unicode";
  });

  useEffect(() => {
    window.localStorage.setItem(MODE_KEY, mode);
  }, [mode]);

  const output = useMemo(() => convert(input, mode), [input, mode]);

  const handleCopy = async () => {
    if (!output) {
      toast({ title: "Nothing to copy", description: "Type something first." });
      return;
    }
    try {
      await navigator.clipboard.writeText(output);
      toast({ title: "Copied", description: "Output copied to clipboard." });
    } catch {
      toast({ title: "Copy failed", description: "Your browser blocked clipboard access." });
    }
  };

  const handleClear = () => {
    setInput("");
  };

  const handleDownloadTxt = () => {
    if (!output) {
      toast({ title: "Nothing to download", description: "Type something first." });
      return;
    }
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SPsinhalish-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded", description: "Saved as a .txt file." });
  };

  const handleDownloadDocx = async () => {
    if (!output) {
      toast({ title: "Nothing to export", description: "Type something first." });
      return;
    }
    try {
      await exportDocx(output, mode);
      toast({ title: "Document ready", description: "Your .docx has been generated." });
    } catch (err) {
      console.error(err);
      toast({ title: "Export failed", description: "Could not generate the document." });
    }
  };

  const inputCount = input.length;
  const outputCount = output.length;
  const inputWords = countWords(input);
  const outputWords = countWords(output);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-sm">
              <span className="text-sm">SP</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold tracking-tight">SPsinhalish</span>
                <span className="font-sinhala text-sm text-muted-foreground hidden sm:inline">
                  සිංහලිෂ්
                </span>
              </div>
              <div className="text-xs text-muted-foreground -mt-0.5 hidden sm:block">
                Singlish &rarr; Sinhala, instantly
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TypingGuide />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex flex-wrap items-center justify-between gap-3"
        >
          <div className="inline-flex rounded-lg border border-border bg-card p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setMode("unicode")}
              data-testid="button-mode-unicode"
              className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                mode === "unicode"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Languages className="h-3.5 w-3.5" />
              Unicode
            </button>
            <button
              type="button"
              onClick={() => setMode("legacy")}
              data-testid="button-mode-legacy"
              className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                mode === "legacy"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Legacy (FM-Abhaya)
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} data-testid="button-copy">
              <Copy className="h-4 w-4" />
              <span className="hidden sm:inline">Copy</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear} data-testid="button-clear">
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadTxt} data-testid="button-txt">
              <FileText className="h-4 w-4" />
              .txt
            </Button>
            <Button size="sm" onClick={handleDownloadDocx} data-testid="button-docx">
              <FileDown className="h-4 w-4" />
              <span>Creative .docx</span>
            </Button>
          </div>
        </motion.div>

        {mode === "legacy" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-4 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm text-foreground/80"
          >
            <span className="font-medium text-primary">Legacy mode active.</span>{" "}
            Copy the output, paste into MS Word, then apply the <span className="font-mono">FM-Abhaya</span> font.
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm font-medium">English (Singlish)</span>
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">
                {inputCount} chars · {inputWords} words
              </span>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="mama gedara yanawa..."
              data-testid="input-singlish"
              className="min-h-[320px] sm:min-h-[420px] resize-none border-0 rounded-none bg-transparent font-mono text-base focus-visible:ring-0 p-4"
              spellCheck={false}
            />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium">
                  {mode === "unicode" ? "Sinhala (Unicode)" : "Sinhala (FM-Abhaya ASCII)"}
                </span>
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">
                {outputCount} chars · {outputWords} words
              </span>
            </div>
            <div
              data-testid="output-sinhala"
              className={`min-h-[320px] sm:min-h-[420px] overflow-auto whitespace-pre-wrap break-words p-4 ${
                mode === "unicode" ? "font-sinhala text-xl leading-relaxed" : "font-mono text-base"
              }`}
            >
              {output ? (
                output
              ) : (
                <span className="text-muted-foreground/60 text-base">
                  {mode === "unicode"
                    ? "ඔබේ සිංහල පාඨය මෙතන දිස්වෙයි"
                    : "FM-Abhaya output will appear here"}
                </span>
              )}
            </div>
          </motion.section>
        </div>
      </main>

      <footer className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        Crafted in Colombo · SPsinhalish &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
