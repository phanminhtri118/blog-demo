import { Button } from "@/shared/components/ui/button";
import { CheckCircle, Lock, Star, HelpCircle } from "lucide-react";
import Link from "next/link";

const AirdropCard = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">Airdrop Medals</p>
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">0</p>
          <p className="text-sm text-gray-500">$BIC</p>
          <Star className="h-5 w-5 text-yellow-400" />
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-2">
        Complete all steps below to be eligible for the Airdrop.
      </p>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">1. Activate BIC Wallet</p>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-7">
            Activate
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">2. Install BIC Group app</p>
          <Button size="sm" variant="outline" className="h-7 text-gray-500" disabled>
            <Lock className="h-3 w-3 mr-1" />
            Install
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">3. Verify your account (KYC)</p>
          <Button size="sm" variant="outline" className="h-7 text-gray-500" disabled>
            <Lock className="h-3 w-3 mr-1" />
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
};

const PremiumCard = () => {
  return (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-800 rounded-lg p-4 text-white text-center">
      <h3 className="font-bold">Get Premium to boost your Medals</h3>
      <p className="text-xs text-purple-200 mt-1">
        Your chance to boost your Medals and get special benefits from premium features.
      </p>
      <div className="my-4 flex justify-center">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
          <Star className="h-10 w-10 text-yellow-300" />
        </div>
      </div>
      <Button className="bg-white text-purple-700 font-bold w-full hover:bg-gray-100">
        Upgrade
      </Button>
    </div>
  );
};

const WelcomeCard = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-bold mb-2">Welcome to TechHub (BIC)</h3>
      <ul className="space-y-2 text-sm text-gray-600">
        <li>
          <Link href="#" className="hover:text-purple-600">
            Quick Introductions and Guides
          </Link>
        </li>
        <li>
          <Link href="#" className="hover:text-purple-600">
            Culture and Community Guidelines
          </Link>
        </li>
      </ul>
      <h3 className="font-bold mt-4 mb-2">TechHub (BIC) Project</h3>
      <ul className="space-y-2 text-sm text-gray-600">
        <li>
          <Link href="#" className="hover:text-purple-600">
            TechHub - Journey of Aspiration
          </Link>
        </li>
        <li>
          <Link href="#" className="hover:text-purple-600">
            Becoming a Savvy BIC Holder
          </Link>
        </li>
        <li>
          <Link href="#" className="hover:text-purple-600">
            BIC Tokens Acquisition for Beginners
          </Link>
        </li>
      </ul>
    </div>
  );
};

const TrendingCard = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-bold mb-2">Trending</h3>
      <ul>
        <li className="flex items-center gap-2">
          <span className="text-gray-500">1</span>
          <div className="w-6 h-6 rounded-md bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
            BIC
          </div>
          <p className="text-sm font-semibold">TechHub Global Admin</p>
          <CheckCircle className="h-4 w-4 text-purple-600" />
        </li>
      </ul>
    </div>
  );
};

const RightSidebar = () => {
  return (
    <aside className="hidden xl:block w-80 shrink-0">
      <div className="sticky top-20 flex flex-col gap-4">
        <AirdropCard />
        <PremiumCard />
        <WelcomeCard />
        <TrendingCard />
      </div>
    </aside>
  );
};

export { RightSidebar };
