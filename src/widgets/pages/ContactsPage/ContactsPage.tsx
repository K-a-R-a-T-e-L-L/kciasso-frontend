import PageHero from "@/shared/ui/PageHero/PageHero";
import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import LinkTabsNav from "@/shared/ui/TabsNav/LinkTabsNav";
import { contacts, primaryContacts } from "@/shared/content/contacts.mock";
import { aboutCenterTabs, contactEmployees } from "@/shared/content/aboutCenter";
import cls from "./ContactsPage.module.scss";

export default function ContactsPage() {
  const cards = [
    { label: "Приемная", value: contacts.phone, href: "tel:+73842587025" },
    { label: "Электронная почта", value: contacts.email, href: `mailto:${contacts.email}` },
    { label: "Адрес", value: "650000, г. Кемерово, пр-т Кузнецкий, 26" },
    { label: "Режим работы", value: "Пн - Пт с 8:30 до 17:30" },
  ];

  return (
    <>
      <PageHero
        eyebrow="О центре"
        title="Контакты"
        description="Контактная информация учреждения, основные каналы связи и список сотрудников."
        breadcrumbs={[
          { title: "Главная", href: "/" },
          { title: "О центре", href: "/o-centre" },
          { title: "Контакты" },
        ]}
      />
      <Container>
        <LinkTabsNav
          ariaLabel="Разделы о центре"
          activeKey="/o-centre/kontakty"
          items={aboutCenterTabs.map((item) => ({
            key: item.href,
            title: item.title,
            href: item.href,
          }))}
        />
      </Container>
      <Section>
        <Container>
          <div className={cls.grid}>
            {cards.map((card) => (
              <div className={cls.card} key={card.label}>
                <span>{card.label}</span>
                {card.href ? <a href={card.href}>{card.value}</a> : <strong>{card.value}</strong>}
              </div>
            ))}
          </div>

          <div className={cls.infoPanel}>
            <div>
              <p>Государственная итоговая аттестация</p>
              <h2>Телефоны для справок и обращений</h2>
            </div>
            <div className={cls.hotlineList}>
              {primaryContacts.map((item) => (
                <div key={item.label} className={cls.hotlineItem}>
                  <span>{item.label}</span>
                  {item.href ? <a href={item.href}>{item.value}</a> : <strong>{item.value}</strong>}
                </div>
              ))}
            </div>
          </div>

          <div className={cls.staffPanel}>
            <div className={cls.staffHeading}>
              <p>Сотрудники</p>
              <h2>Руководство и ответственные специалисты</h2>
            </div>
            <div className={cls.staffList}>
              {contactEmployees.map((employee) => (
                <div key={employee.name} className={cls.staffItem}>
                  <strong>{employee.name}</strong>
                  <span>{employee.position}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
