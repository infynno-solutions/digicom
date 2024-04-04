import { redirect } from "next/navigation";
import { ReactNode } from "react";
import SettingsSidebar from "@/components/settings/settings-sidebar";
import { getCurrentUser } from "@/lib/session";

export default async function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/login");
  }

  return (
    <main className="p-4 sm:px-6 sm:py-0">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <div className="mt-8 grid items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <SettingsSidebar />
        <div className="grid gap-6">{children}</div>
      </div>
    </main>
  );
}
