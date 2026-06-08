"use client";

import { useEffect } from "react";
import { APP_VERSION } from "@/lib/version";

export default function AutoRefresh() {
  useEffect(() => {
    const currentVersion = localStorage.getItem("app_version");

    if (currentVersion !== APP_VERSION) {
      localStorage.setItem("app_version", APP_VERSION);
      window.location.reload();
    }
  }, []);

  return null;
}
