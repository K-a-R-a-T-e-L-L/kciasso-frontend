import Link from "next/link";
import Image from "next/image";
import Container from "@/shared/ui/Container/Container";
import { MEDIA } from "@/shared/lib/media";
import { navigation, usefulResources } from "@/shared/config/navigation";
import { contacts, primaryContacts } from "@/shared/content/contacts.mock";
import cls from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={cls.footer}>
      <Container>
        <div className={cls.grid}>
          <div className={cls.brandBlock}>
            <Link href="/" className={cls.brand}>
              <Image src={MEDIA.logo} alt={contacts.shortName} width={52} height={52} />
              <div>
                <span>{contacts.shortName}</span>
                <small>{contacts.fullName}</small>
              </div>
            </Link>
            <p>
              {contacts.legalForm} {contacts.fullName}. Официальный информационный ресурс по вопросам государственной
              итоговой аттестации, оценки качества образования и деятельности учреждения.
            </p>
          </div>
          <div>
            <h3>Разделы</h3>
            <div className={cls.links}>
              {navigation.slice(1).map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3>Полезные ресурсы</h3>
            <div className={cls.links}>
              {usefulResources.slice(0, 5).map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3>Контакты</h3>
            <div className={cls.links}>
              <Link href="/o-centre/kontakty">Страница контактов</Link>
              <a href="mailto:info@kcias.ru">{contacts.email}</a>
              {primaryContacts.map((item) => (
                <a key={item.label} href={item.href}>
                  <span>{item.label}</span>
                  {item.value}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className={cls.bottom}>© {contacts.shortName}. Все права защищены.</div>
      </Container>
    </footer>
  );
}
