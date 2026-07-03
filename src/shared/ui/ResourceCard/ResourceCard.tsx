import Link from "next/link";
import cls from "./ResourceCard.module.scss";

type Props = {
  title: string;
  href: string;
  description?: string;
};

export default function ResourceCard({ title, href, description }: Props) {
  const isExternal = href.startsWith("http");
  return (
    <Link className={cls.card} href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer" : undefined}>
      <div>
        <span className={cls.badge}>{isExternal ? "Внешний ресурс" : "Раздел сайта"}</span>
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      <span className={cls.action}>Открыть</span>
    </Link>
  );
}
