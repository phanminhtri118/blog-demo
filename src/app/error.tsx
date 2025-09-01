"use client";

import { useEffect } from "react";
import { Button } from "@/shared/components/ui/button";

const Error = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-red-500">{error.message}</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
};

export default Error;
