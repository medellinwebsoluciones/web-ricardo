import {
  Server,
  Bot,
  Activity,
  Layers,
  BrainCircuit,
  Boxes,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Server,
  Bot,
  Activity,
  Layers,
  BrainCircuit,
  Boxes,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Boxes;
}
