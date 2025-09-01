import React from "react";

interface SearchLayoutProps {
  filters: React.ReactNode;
  results: React.ReactNode;
}

export const SearchLayout = ({ filters, results }: SearchLayoutProps) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="col-span-1">{filters}</aside>
        <main className="col-span-1 lg:col-span-3">{results}</main>
      </div>
    </div>
  );
};
