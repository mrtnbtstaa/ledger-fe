"use client";

import { useParams } from "next/navigation";
import { useReceipt } from "@/hooks/useReceipt";

export function useRouteReceipt() {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === "string" ? params.id : null;
  const receipt = useReceipt(id);
  return { id, receipt };
}