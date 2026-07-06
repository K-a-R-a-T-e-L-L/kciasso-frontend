import Link from "next/link";
import cls from "./NewsCard.module.scss";

type Props = {
  title: string;
  date: string;
  href: string;
  text: string;
};

export default function NewsCard({ title, date, href, text }: Props) {
  const isHashLink = href.startsWith("/") && href.includes("#");

  const content = (
    <>
      <time>{date}</time>
      <h3>{title}</h3>
      <p>{text}</p>
    </>
  );

  return isHashLink ? (
    <a className={cls.card} href={href}>
      {content}
    </a>
  ) : (
    <Link className={cls.card} href={href}>
      {content}
    </Link>
  );
}
