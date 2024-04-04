"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuCreditCard, LuUser } from "react-icons/lu";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "General",
    href: "/dashboard/settings/general",
    icon: <LuUser className="mr-2 h-5 w-5" />,
  },
  {
    title: "Payments",
    href: "/dashboard/settings/payments",
    icon: <LuCreditCard className="mr-2 h-5 w-5" />,
  },
];

const SettingsSidebar = () => {
  const pathname = usePathname();

  return (
    <nav className="grid gap-2 text-sm text-muted-foreground">
      {items.map((item) => (
        <Link
          key={item.href}
          className={cn(
            "flex items-center rounded-lg border border-transparent px-4 py-2.5 font-medium text-primary",
            pathname === item.href && "border-gray-200 bg-white shadow",
          )}
          href={item.href}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default SettingsSidebar;
