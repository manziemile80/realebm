import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useEbm } from "@/context/EbmContext";
import { Badge } from "@/components/ui/badge";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useEbm();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center justify-between border-b border-border bg-card px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm font-semibold text-foreground">EdTech Solutions Training Center</span>
            </div>
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{user.name}</span>
                <Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize text-xs">
                  {user.role}
                </Badge>
              </div>
            )}
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
