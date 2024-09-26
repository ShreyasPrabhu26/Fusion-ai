import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./sidebar";
import { getApiLimitInfo } from "@/lib/api-limit";

const MobileSidebar = async () => {
  const tokenInfoObject = await getApiLimitInfo();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <Sidebar tokenInfoObject={tokenInfoObject} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
