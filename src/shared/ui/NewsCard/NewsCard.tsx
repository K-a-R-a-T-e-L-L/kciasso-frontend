import Link from "next/link";
import cls from "./NewsCard.module.scss";

type Props = {
  title: string;
  date: string;
  href: string;
  text: string;
};

export default function NewsCard({ title, date, href, text }: Props) {
  return (
    <Link className={cls.card} href={href}>
      <time>{date}</time>
      <h3>{title}</h3>
      <p>{text}</p>
    </Link>
  );
}
