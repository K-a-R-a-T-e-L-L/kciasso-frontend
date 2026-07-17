"use client";

import { useEffect } from "react";

export default function RegionalProjectHashRedirect() {
  useEffect(() => {
    const slug = window.location.hash.replace(/^#/, "");
    if (["ege", "vuz", "video"].includes(slug)) {
      window.location.replace(`/regionalnyy-proekt/${slug}`);
    }
  }, []);
  return null;
}
