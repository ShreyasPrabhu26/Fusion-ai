import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { getApiLimitInfo } from "@/lib/api-limit";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const tokenInfoObject = await getApiLimitInfo();

  if (tokenInfoObject.error_message) {
    redirect("/");
    // console.log(tokenInfoObject.error_message);
  }

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <Sidebar tokenInfoObject={tokenInfoObject} />
      </div>
      <main className="md:pl-72">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
