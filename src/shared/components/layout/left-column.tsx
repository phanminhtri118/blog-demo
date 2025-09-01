import { Button } from "@/shared/components/ui/button";
import { Plus, Search, CheckCircle } from "lucide-react";
import Link from "next/link";

export const LeftColumn = () => {
  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-20 flex flex-col gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm">Your communities</h3>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <ul>
            <li>
              <Link href="#" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100">
                <div className="w-8 h-8 rounded-md bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                  3AM
                </div>
                <span className="font-semibold text-sm">TechHub Việt Nam</span>
                <CheckCircle className="h-4 w-4 text-purple-600 ml-auto" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};
