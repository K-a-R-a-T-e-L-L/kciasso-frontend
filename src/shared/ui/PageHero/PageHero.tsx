import Container from "@/shared/ui/Container/Container";
import Breadcrumbs, { BreadcrumbItem } from "@/shared/ui/Breadcrumbs/Breadcrumbs";
import cls from "./PageHero.module.scss";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
};

export default function PageHero({ eyebrow, title, description, breadcrumbs }: Props) {
  return (
    <div className={cls.hero}>
      <Container>
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
        <div className={cls.card}>
          {eyebrow ? <p className={cls.eyebrow}>{eyebrow}</p> : null}
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
        </div>
      </Container>
    </div>
  );
}
