import Link from "next/link";
import cls from "./NewsCard.module.scss";

type Props = {
  title: string;
  date: string;
  href: string;
  text: string;
  category?: string;
  coverImageUrl?: string | null;
  showImage?: boolean;
};

export default function NewsCard({ title, date, href, text, category, coverImageUrl, showImage = false }: Props) {
  const isHashLink = href.startsWith("/") && href.includes("#");
  const className = `${cls.card} ${showImage ? cls.withImage : ""}`.trim();

  const content = (
    <>
      {showImage ? (
        <span className={cls.media} aria-hidden={coverImageUrl ? undefined : true}>
          {coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className={cls.image} src={coverImageUrl} alt={title} />
          ) : (
            <span className={cls.placeholder}>
              <span>Новости</span>
            </span>
          )}
        </span>
      ) : null}
      <span className={cls.body}>
        <span className={cls.meta}>
          {category ? <span>{category}</span> : null}
          <time>{date}</time>
        </span>
        <h3>{title}</h3>
        <p>{text}</p>
      </span>
    </>
  );

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
