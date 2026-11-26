import {
  Carrot,
  Coffee,
  CookingPot,
  Croissant,
  Droplet,
  Egg,
  Fish,
  Flame,
  Fuel,
  Milk,
  Package,
  ShoppingBasket,
  Soup,
  SprayCan,
  Store,
  Wheat,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Carrot,
  Coffee,
  CookingPot,
  Croissant,
  Droplet,
  Egg,
  Fish,
  Flame,
  Fuel,
  Milk,
  Package,
  ShoppingBasket,
  Soup,
  SprayCan,
  Wheat,
  Wine,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Store;
  return <Icon className={cn("size-5", className)} aria-hidden="true" />;
}
