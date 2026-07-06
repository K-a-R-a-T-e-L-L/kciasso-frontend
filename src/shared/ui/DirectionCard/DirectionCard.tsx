import Link from "next/link";
import type { CardItem } from "@/shared/content/mock";
import cls from "./DirectionCard.module.scss";

type Props = CardItem & {
  index?: number;
  isActive?: boolean;
};

export default function DirectionCard({
  title,
  href,
  description,
  badge,
  index = 0,
  isActive = false,
}: Props) {
  const isHashLink = href.startsWith("/") && href.includes("#");

  const content = (
    <>
      <span className={cls.number}>{String(index + 1).padStart(2, "0")}</span>
      {badge ? <span className={cls.badge}>{badge}</span> : null}
      <h3>{title}</h3>
      <p>{description}</p>
      <span className={cls.more}>Перейти</span>
    </>
  );

  const className = `${cls.card} ${isActive ? cls.active : ""}`.trim();

  return isHashLink ? (
    <a className={className} href={href}>
      {content}
    </a>
  ) : (
    <Link className={className} href={href}>
      {content}
    </Link>
  );
}