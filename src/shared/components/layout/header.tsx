"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Bell, Home, Search, Trophy, Wallet, Building } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Header = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-purple-600">
            <div className="bg-purple-600 text-white w-8 h-8 flex items-center justify-center rounded-md">
              3
            </div>
            <span>AM</span>
          </Link>
        </div>

        <div className="flex-1 hidden md:flex items-center justify-center gap-6">
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/"
              aria-label="Home"
              className="p-2 text-purple-600 border-b-2 border-purple-600"
            >
              <Home className="h-6 w-6" />
            </Link>
            <Link
              href="/leaderboard"
              aria-label="Leaderboard"
              className="p-2 text-gray-500 hover:text-purple-600"
            >
              <Trophy className="h-6 w-6" />
            </Link>
            <Link
              href="/store"
              aria-label="Store"
              className="p-2 text-gray-500 hover:text-purple-600"
            >
              <Building className="h-6 w-6" />
            </Link>
          </nav>
          <form
            onSubmit={handleSearchSubmit}
            data-testid="search-form"
            className="relative w-full max-w-md hidden md:block"
          >
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
            >
              <Search className="h-5 w-5" />
            </button>
            <Input
              placeholder="Search content"
              className="pl-10 bg-gray-100 border-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => router.push("/search")}
          >
            <Search className="h-6 w-6 text-gray-600" />
          </Button>
          <SignedIn>
            <UserButton />
            <Button variant="outline" className="hidden sm:inline-flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              <span>Wallet</span>
            </Button>
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};
