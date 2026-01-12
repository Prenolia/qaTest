import {
  type SimulationMode
} from "@/contexts/NetworkSimulationContext";
import { Clock, Settings2, Shuffle, XCircle, Zap } from "lucide-react";

export const SIMULATION_MODES: {
  mode: SimulationMode;
  label: string;
  description: string;
  icon: typeof Clock;
  color: string;
}[] = [
  {
    mode: "none",
    label: "Normal",
    description: "No simulation",
    icon: Zap,
    color: "text-green-600 bg-green-100",
  },
  {
    mode: "slow",
    label: "Slow",
    description: "2-5s random delay",
    icon: Clock,
    color: "text-blue-600 bg-blue-100",
  },
  {
    mode: "unreliable",
    label: "Unreliable",
    description: "50% failure rate",
    icon: Shuffle,
    color: "text-purple-600 bg-purple-100",
  },
  {
    mode: "error",
    label: "Error",
    description: "Always fails",
    icon: XCircle,
    color: "text-red-600 bg-red-100",
  },
  {
    mode: "custom",
    label: "Custom",
    description: "Configure delay & error rate",
    icon: Settings2,
    color: "text-orange-600 bg-orange-100",
  },
];