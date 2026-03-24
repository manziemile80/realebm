import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useEbm } from "@/context/EbmContext";
import { Badge } from "@/components/ui/badge";
import EbmHeader from "@/components/EbmHeader";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useEbm();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full flex-col">
        {/* EBM-style top status bar */}
        <EbmHeader />

        <div className="flex flex-1">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            {/* Yellow action bar */}
            <header className="h-10 flex items-center justify-between border-b border-border bg-secondary px-3">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="text-secondary-foreground" />
                <span className="text-xs font-bold text-secondary-foreground">EdTech Solutions Training Center — EBM Simulator</span>
              </div>
              {user && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-secondary-foreground">{user.name}</span>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                    className="capitalize text-[10px] h-5"
                  >
                    {user.role}
                  </Badge>
                </div>
              )}
            </header>
            <main className="flex-1 p-3 md:p-4 overflow-auto bg-background">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
