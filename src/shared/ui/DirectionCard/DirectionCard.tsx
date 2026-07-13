import Image from "next/image";
import Link from "next/link";
import type { CardItem } from "@/shared/content/content.types";
import cls from "./DirectionCard.module.scss";

type Props = CardItem & {
  index?: number;
  isActive?: boolean;
  variant?: "detailed" | "compact" | "logo";
};

export default function DirectionCard({
  title,
  href,
  description,
  badge,
  logoSrc,
  index = 0,
  isActive = false,
  variant = "detailed",
}: Props) {
  const isHashLink = href.startsWith("/") && href.includes("#");
  const isExternal = /^https?:\/\//.test(href);
  const isCompact = variant === "compact";
  const isLogo = variant === "logo";

  const content = (
    <>
      {!isLogo ? <span className={cls.number}>{String(index + 1).padStart(2, "0")}</span> : null}
      {logoSrc ? (
        <span className={`${cls.logoPlaceholder} ${isLogo ? cls.logoPlaceholderLarge : ""}`.trim()} aria-hidden="true">
          <Image src={logoSrc} alt="" width={164} height={78} className={cls.logoImage} />
        </span>
      ) : null}
      {!isLogo && !isCompact && badge ? <span className={cls.badge}>{badge}</span> : null}
      {!isLogo || !logoSrc ? <h3>{title}</h3> : null}
      {!isLogo && !isCompact ? <p>{description}</p> : null}
      {!isLogo ? <span className={cls.more}>Подробнее</span> : null}
    </>
  );

  const className = `${cls.card} ${isCompact ? cls.compact : ""} ${isLogo ? cls.logoCard : ""} ${isActive ? cls.active : ""}`.trim();
  const ariaLabel = isLogo ? title : undefined;

  return isHashLink ? (
    <a className={className} href={href} aria-label={ariaLabel}>
      {content}
    </a>
  ) : isExternal ? (
    <a className={className} href={href} target="_blank" rel="noreferrer" aria-label={ariaLabel}>
      {content}
    </a>
  ) : (
    <Link className={className} href={href} aria-label={ariaLabel}>
      {content}
    </Link>
  );
}
