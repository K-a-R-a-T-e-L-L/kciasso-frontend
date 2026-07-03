import Link from "next/link";
import Image from "next/image";
import { MEDIA } from "@/shared/lib/media";
import { contacts } from "@/shared/content/mock";
import HeaderNav from "./HeaderNav.client";
import HeaderMobileMenu from "./HeaderMobileMenu.client";
import cls from "./Header.module.scss";

export default function Header() {
  return (
    <header className={cls.header}>
      <div className={cls.inner}>
        <Link className={cls.brand} href="/" aria-label="На главную">
          <span className={cls.logoBox}>
            <Image src={MEDIA.logo} alt={contacts.shortName} width={42} height={42} priority />
          </span>
          <span>
            <strong>{contacts.shortName}</strong>
            <small>Информационно-аналитическое сопровождение системы образования</small>
          </span>
        </Link>

        <HeaderNav />
        <HeaderMobileMenu />
      </div>
    </header>
  );
}
