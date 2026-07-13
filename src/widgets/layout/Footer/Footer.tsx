import Image from "next/image";
import Link from "next/link";
import { getPrimaryContacts } from "@/shared/api/adapters/site-settings.adapter";
import { navigation, usefulResources } from "@/shared/config/navigation";
import type { SiteContacts } from "@/shared/content/content.types";
import { organizationProfile } from "@/shared/content/default-site-settings";
import { MEDIA } from "@/shared/lib/media";
import Container from "@/shared/ui/Container/Container";
import cls from "./Footer.module.scss";

type Props = {
  contacts: SiteContacts;
};

export default function Footer({ contacts }: Props) {
  const primaryContacts = getPrimaryContacts(contacts);

  return (
    <footer className={cls.footer}>
      <Container>
        <div className={cls.grid}>
          <div className={cls.brandBlock}>
            <Link href="/" className={cls.brand}>
              <Image src={MEDIA.images.logo} alt={organizationProfile.shortName} width={52} height={52} />
              <div>
                <span>{organizationProfile.shortName}</span>
                <small>{organizationProfile.fullName}</small>
              </div>
            </Link>
            <p>
              {organizationProfile.legalForm} {organizationProfile.fullName}. Официальный информационный ресурс по вопросам
              государственной итоговой аттестации, оценки качества образования и деятельности учреждения.
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
              {primaryContacts.map((item) => (
                <a key={`${item.label}-${item.value}`} href={item.href}>
                  <span>{item.label}</span>
                  {item.value}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className={cls.bottom}>© {organizationProfile.shortName}. Все права защищены.</div>
      </Container>
    </footer>
  );
}
