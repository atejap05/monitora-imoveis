import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarFilters from "./components/sidebar/SidebarFilters";
import Header from "./components/Header";
import TabsNav from "./components/tabs-navigation/TabsNav";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />

      <SidebarProvider>
        <div className="flex h-screen w-full">
          <SidebarFilters />

          <div className="flex w-full">
            <SidebarTrigger />
            <TabsNav />
          </div>
          {/* <main className="h-full p-4">{children}</main> */}
        </div>
      </SidebarProvider>
    </>
  );
};

export default Layout;
