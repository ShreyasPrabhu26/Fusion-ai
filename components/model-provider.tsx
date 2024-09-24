"use client";

import React, { useEffect, useState } from "react";

import ProModel from "@/components/pro-model";

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <ProModel />
    </>
  );
}
