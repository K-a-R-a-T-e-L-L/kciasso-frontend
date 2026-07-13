import Link from "next/link";
import { getPrimaryContacts } from "@/shared/api/adapters/site-settings.adapter";
import type { SiteContacts } from "@/shared/content/content.types";
import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import cls from "./UniversalContactsSection.module.scss";

type Props = {
  contacts: SiteContacts;
};

export default function UniversalContactsSection({ contacts }: Props) {
  const primaryContacts = getPrimaryContacts(contacts);

  return (
    <Section className={cls.section}>
      <Container>
        <div className={cls.contactCta}>
          <div>
            <p className={cls.badge}>Справочная информация</p>
            <h2>Контакты для обращений по вопросам ГИА и работы сайта</h2>
            <p className={cls.text}>
              По вопросам государственной итоговой аттестации, размещённых материалов и работы сервисов можно
              воспользоваться телефонами справочной службы или перейти на страницу контактов.
            </p>
          </div>
          <div className={cls.contactBox}>
            <strong>{contacts.giaHotline.value}</strong>
            <div className={cls.contactList}>
              {primaryContacts.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <a href={item.href}>{item.value}</a>
                </div>
              ))}
            </div>
            <Link href="/o-centre/kontakty">Страница контактов</Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
