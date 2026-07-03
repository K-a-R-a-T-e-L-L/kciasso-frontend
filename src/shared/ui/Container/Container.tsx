import type { HTMLAttributes } from "react";
import cls from "./Container.module.scss";

type Props = HTMLAttributes<HTMLDivElement> & {
  size?: "default" | "narrow" | "wide";
};

export default function Container({ className = "", size = "default", ...props }: Props) {
  return <div className={`${cls.container} ${cls[size]} ${className}`} {...props} />;
}
