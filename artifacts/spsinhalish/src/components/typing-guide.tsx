import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Keyboard } from "lucide-react";

type Pair = { en: string; si: string };

const vowels: Pair[] = [
  { en: "a", si: "අ" },
  { en: "aa", si: "ආ" },
  { en: "ae", si: "ඇ" },
  { en: "aae", si: "ඈ" },
  { en: "i", si: "ඉ" },
  { en: "ii", si: "ඊ" },
  { en: "u", si: "උ" },
  { en: "uu", si: "ඌ" },
  { en: "e", si: "එ" },
  { en: "ee", si: "ඒ" },
  { en: "ai", si: "ඓ" },
  { en: "o", si: "ඔ" },
  { en: "oo", si: "ඕ" },
  { en: "au", si: "ඖ" },
];

const consonants: Pair[] = [
  { en: "k", si: "ක" },
  { en: "g", si: "ග" },
  { en: "ng", si: "ඟ" },
  { en: "ch", si: "ච" },
  { en: "j", si: "ජ" },
  { en: "t", si: "ත" },
  { en: "d", si: "ද" },
  { en: "n", si: "න" },
  { en: "p", si: "ප" },
  { en: "b", si: "බ" },
  { en: "m", si: "ම" },
  { en: "y", si: "ය" },
  { en: "r", si: "ර" },
  { en: "l", si: "ල" },
  { en: "w / v", si: "ව" },
  { en: "s", si: "ස" },
  { en: "sh", si: "ශ" },
  { en: "h", si: "හ" },
  { en: "f", si: "ෆ" },
];

const aspirated: Pair[] = [
  { en: "kh", si: "ඛ" },
  { en: "gh", si: "ඝ" },
  { en: "jh", si: "ඣ" },
  { en: "th", si: "ත" },
  { en: "dh", si: "ද" },
  { en: "ph", si: "ඵ" },
  { en: "bh", si: "භ" },
];

const examples: Pair[] = [
  { en: "mama", si: "මම" },
  { en: "gedara", si: "ගෙදර" },
  { en: "yanawa", si: "යනව" },
  { en: "kohomada", si: "කොහොමද" },
  { en: "lassanai", si: "ලස්සනයි" },
  { en: "obata", si: "ඔබට" },
  { en: "sthuthi", si: "ස්තුති" },
  { en: "aayubowan", si: "ආයුබොවන්" },
];

function PairTable({ pairs }: { pairs: Pair[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {pairs.map((p) => (
        <div
          key={p.en}
          className="flex items-center justify-between gap-2 rounded-md border border-border bg-card/50 px-3 py-2"
        >
          <span className="font-mono text-sm text-muted-foreground">{p.en}</span>
          <span className="font-sinhala text-base text-foreground">{p.si}</span>
        </div>
      ))}
    </div>
  );
}

export function TypingGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-testid="button-typing-guide">
          <Keyboard className="h-4 w-4" />
          <span className="hidden sm:inline">Typing Guide</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Typing Guide</DialogTitle>
          <DialogDescription>
            Type Sinhala the way it sounds in English. Use the longest matching pattern for best results.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 pb-4">
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Vowels</h3>
              <PairTable pairs={vowels} />
            </section>
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Consonants</h3>
              <PairTable pairs={consonants} />
            </section>
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Aspirated &amp; Compound</h3>
              <PairTable pairs={aspirated} />
            </section>
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Common Words</h3>
              <PairTable pairs={examples} />
            </section>
            <section className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <h3 className="mb-2 text-sm font-semibold text-primary">About Legacy (FM-Abhaya) Mode</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Legacy mode outputs ASCII characters used by the FM-Abhaya font family. The output looks like gibberish in the browser — copy it into MS Word and apply the <span className="font-mono">FM-Abhaya</span> font to render proper Sinhala. Coverage is functional for most everyday writing; some rare conjuncts may need manual touch-up.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
