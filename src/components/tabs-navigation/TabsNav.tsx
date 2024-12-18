import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboardIcon } from "lucide-react";

const TabsNav = () => {
  return (
    <Tabs
      defaultValue="tab-1"
      onValueChange={value => console.log(value)}
      className="flex flex-col h-full w-full mr-4"
    >
      <TabsList className="flex-shrink-0 bg-green text-white ">
        <TabsTrigger value="visao-geral">
          <LayoutDashboardIcon size={18} />
          <span className="hidden">Visão Geral</span>
        </TabsTrigger>
        <TabsTrigger value="nfse">Notas Fiscais</TabsTrigger>
        <TabsTrigger value="contribuintes">Contribuintes</TabsTrigger>
        <TabsTrigger value="tab-4">Tab 4</TabsTrigger>
        <TabsTrigger value="tab-5">Tab 5</TabsTrigger>
        <TabsTrigger value="tab-6">Tab 6</TabsTrigger>
      </TabsList>
      <main className="flex-grow text-center">
        <TabsContent value="visao-geral">
          Visão Geral Dashboard content
        </TabsContent>
        <TabsContent value="nfse">Notas Fiscais Dashboard content</TabsContent>
        <TabsContent value="contribuintes">
          Contribuintes Dashboard content
        </TabsContent>
        <TabsContent value="tab-4">Tab 4 content</TabsContent>
        <TabsContent value="tab-5">Tab 5 content</TabsContent>
        <TabsContent value="tab-6">Tab 6 content</TabsContent>
      </main>
    </Tabs>
  );
};

export default TabsNav;
