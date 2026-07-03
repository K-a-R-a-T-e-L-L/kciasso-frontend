import type { HTMLAttributes } from "react";
import cls from "./Section.module.scss";

type Props = HTMLAttributes<HTMLElement> & {
  muted?: boolean;
};

export default function Section({ children, className = "", muted, ...props }: Props) {
  return (
    <section className={`${cls.section} ${muted ? cls.muted : ""} ${className}`} {...props}>
      {children}
    </section>
  );
}
