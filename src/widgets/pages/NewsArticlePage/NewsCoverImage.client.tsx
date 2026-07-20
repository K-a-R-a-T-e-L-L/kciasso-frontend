"use client";
/* eslint-disable @next/next/no-img-element -- supports owned relative and unrestricted external URLs */

import { useState } from "react";
import cls from "./NewsArticlePage.module.scss";

export default function NewsCoverImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return <figure className={cls.cover}><img src={src} alt={alt} className={cls.coverImage} loading="eager" decoding="async" onError={() => setFailed(true)} /></figure>;
}
