"use client";

import React, { useEffect, useState } from "react";
import { Zap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

import { useProModal } from "@/hooks/user-pro-model";

interface TokenInfo {
  usedTokens?: number;
  tokenLimit?: number;
  message?: string;
}

export default function FreeCounter({
  tokenInfoObject,
}: {
  tokenInfoObject: TokenInfo;
}) {
  const { usedTokens = 0, tokenLimit = 0 } = tokenInfoObject;
  const proModal = useProModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-white mb-4 space-y-2">
            <p>
              {usedTokens} / {tokenLimit} Generations
            </p>
            <Progress className="h-3" value={(usedTokens / tokenLimit) * 100} />
          </div>
          <Button
            onClick={proModal.onOpen}
            variant="premium"
            className="w-full"
          >
            Upgrade <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
