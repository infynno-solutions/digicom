import Link from "next/link";
import { LuHome, LuPackage, LuPackage2 } from "react-icons/lu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const menuItems = [
  {
    href: "/dashboard",
    title: "Dashboard",
    icon: <LuHome className="h-5 w-5" />,
  },
  {
    href: "/dashboard/products",
    title: "Products",
    icon: <LuPackage className="h-5 w-5" />,
  },
];

const Sidebar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          href="/dashboard"
        >
          <LuPackage2 className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Digicom</span>
        </Link>
        {menuItems.map((item, i) => (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <Link
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                href={item.href}
              >
                {item.icon}
                <span className="sr-only">{item.title}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{item.title}</TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
