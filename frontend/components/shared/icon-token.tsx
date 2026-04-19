import {
  Blocks,
  BrainCircuit,
  BriefcaseBusiness,
  ChartColumnIncreasing,
  CloudCog,
  Code2,
  Landmark,
  Layers3,
  Network,
  Presentation,
  ServerCog,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Blocks,
  BrainCircuit,
  BriefcaseBusiness,
  ChartColumnIncreasing,
  CloudCog,
  Code2,
  Landmark,
  Layers3,
  Network,
  Presentation,
  ServerCog,
  ShieldCheck,
  Sparkles,
};

export function IconToken({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name] ?? Sparkles;
  return <Icon className={className} />;
}
