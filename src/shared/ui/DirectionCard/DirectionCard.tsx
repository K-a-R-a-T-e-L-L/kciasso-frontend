import Link from "next/link";
import type { CardItem } from "@/shared/content/mock";
import cls from "./DirectionCard.module.scss";

type Props = CardItem & {
  index?: number;
};

export default function DirectionCard({ title, href, description, badge, index = 0 }: Props) {
  return (
    <Link className={cls.card} href={href}>
      <span className={cls.number}>{String(index + 1).padStart(2, "0")}</span>
      {badge ? <span className={cls.badge}>{badge}</span> : null}
      <h3>{title}</h3>
      <p>{description}</p>
      <span className={cls.more}>Перейти</span>
    </Link>
  );
}
