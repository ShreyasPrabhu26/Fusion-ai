import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const PricingHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <section className="text-center">
    <h2 className="text-3xl font-bold">{title}</h2>
    <p className="text-xl pt-1">{subtitle}</p>
    <br />
  </section>
);

export const CheckItem = ({ text }: { text: string }) => (
  <div className="flex gap-2">
    <CheckCircle2 size={18} className="my-auto text-green-400" />
    <p className="pt-0.5 text-zinc-700 dark:text-zinc-300 text-sm">{text}</p>
  </div>
);

type PricingCardProps = {
  title: string;
  price?: number | string;
  description: string;
  features: string[];
  actionLabel: string;
  popular?: boolean;
  exclusive?: boolean;
  isProcessing: boolean;
  onClickHandler: () => void;
};

export const PricingCard = ({
  title,
  price,
  description,
  features,
  actionLabel,
  popular,
  exclusive,
  onClickHandler,
  isProcessing,
}: PricingCardProps) => (
  <Card
    className={cn(
      `w-72 flex flex-col justify-between py-1 ${
        popular ? "border-rose-400" : "border-zinc-700"
      } mx-auto sm:mx-0`,
      {
        "animate-background-shine bg-white dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] transition-colors":
          exclusive,
      }
    )}
  >
    <div>
      <CardHeader className="pb-8 pt-4">
        <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">
          {title}
        </CardTitle>
        {title === "Enterprise" ? (
          <></>
        ) : (
          <div className="flex items-end gap-1">
            <h3 className="text-3xl font-bold">₹{price}</h3>
            <span className="text-xl">Tokens</span>
          </div>
        )}
        <CardDescription className="pt-1.5 h-12">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {features.map((feature: string) => (
          <CheckItem key={feature} text={feature} />
        ))}
      </CardContent>
    </div>
    <CardFooter className="mt-2">
      <Button
        disabled={isProcessing}
        onClick={(e) => {
          e.stopPropagation();
          onClickHandler();
        }}
        className="relative inline-flex w-full items-center justify-center rounded-md bg-black text-white dark:bg-white px-6 font-medium  dark:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
      >
        <div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe] to-[#8678f9] opacity-75 blur" />
        {actionLabel}
      </Button>
    </CardFooter>
  </Card>
);
