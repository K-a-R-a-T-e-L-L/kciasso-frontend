import PageHero from "@/shared/ui/PageHero/PageHero";
import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import { contacts, primaryContacts } from "@/shared/content/mock";
import cls from "./ContactsPage.module.scss";

export default function ContactsPage() {
  const cards = [
    { label: "Основной телефон", value: contacts.phone, href: "tel:+73842587025" },
    { label: "Электронная почта", value: contacts.email, href: `mailto:${contacts.email}` },
    { label: "Адрес", value: contacts.address },
    { label: "Режим работы", value: contacts.worktime },
  ];

  return (
    <>
      <PageHero
        eyebrow="О Центре"
        title="Контакты"
        description="Контактная информация ГКУ КЦМКО для обращений по разделам сайта и вопросам государственной итоговой аттестации."
        breadcrumbs={[
          { title: "Главная", href: "/" },
          { title: "О Центре", href: "/o-centre" },
          { title: "Контакты" },
        ]}
      />
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

          <div className={cls.mapPlaceholder}>
            <div>
              <p>Дополнительная информация</p>
              <h2>Карта и схема проезда будут добавлены позднее</h2>
              <span>В этом блоке можно разместить карту, схему проезда и дополнительные контакты ответственных специалистов.</span>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
