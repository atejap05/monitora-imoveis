import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboardIcon,
  FileTextIcon,
  User2Icon,
  SearchIcon,
  AppWindowIcon,
} from "lucide-react";

import { useDashboardState } from "@/state/dashboardState";

const TabsNav = ({ children }: { children: React.ReactNode }) => {
  const { setTabValue } = useDashboardState();
  return (
    <Tabs
      defaultValue="visao-geral"
      onValueChange={value => setTabValue(value)}
      className="flex flex-col h-full w-full mr-4"
    >
      <TabsList className="flex-shrink-0 bg-green text-white md:text-lg tracking-wide">
        <TabsTrigger className="flex-between gap-2" value="visao-geral">
          <LayoutDashboardIcon size={18} />
          <span className="hidden md:block">Visão Geral</span>
        </TabsTrigger>
        <TabsTrigger className="flex-between gap-2" value="nfse">
          <FileTextIcon size={18} />
          <span className="hidden md:block">Notas Fiscais</span>
        </TabsTrigger>
        <TabsTrigger className="flex-between gap-2" value="contribuintes">
          <User2Icon size={18} />
          <span className="hidden md:block">Contribuintes</span>
        </TabsTrigger>
        <TabsTrigger className="flex-between gap-2" value="ambiente">
          <AppWindowIcon size={18} />
          <span className="hidden md:block">Ambiente</span>
        </TabsTrigger>
        <TabsTrigger className="flex-between gap-2" value="consultas">
          <SearchIcon size={18} />
          <span className="hidden md:block">Consultas</span>
        </TabsTrigger>
      </TabsList>
      <main className="flex-grow text-center">{children}</main>
    </Tabs>
  );
};

export default TabsNav;

//    <TabsContent value="visao-geral">
//       Visão Geral Dashboard content
//     </TabsContent>
//     <TabsContent value="nfse">Notas Fiscais Dashboard content</TabsContent>
//     <TabsContent value="contribuintes">
//       Contribuintes Dashboard content
//     </TabsContent>
//     <TabsContent value="consultas">Painel Consultas</TabsContent>
//     <TabsContent value="tab-5">Tab 5 content</TabsContent>
//     <TabsContent value="tab-6">Tab 6 content</TabsContent>
