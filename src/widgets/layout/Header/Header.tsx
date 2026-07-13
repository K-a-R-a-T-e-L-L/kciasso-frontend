import Image from "next/image";
import Link from "next/link";
import type { ContactEntry } from "@/shared/content/content.types";
import { organizationProfile } from "@/shared/content/default-site-settings";
import { MEDIA } from "@/shared/lib/media";
import HeaderMobileMenu from "./HeaderMobileMenu.client";
import HeaderNav from "./HeaderNav.client";
import cls from "./Header.module.scss";

type Props = {
  hotline: ContactEntry;
};

export default function Header({ hotline }: Props) {
  return (
    <header className={cls.header}>
      <div className={cls.inner}>
        <Link className={cls.brand} href="/" aria-label="На главную">
          <span className={cls.logoBox}>
            <Image src={MEDIA.images.logo} alt={organizationProfile.shortName} width={42} height={42} priority />
          </span>
          <span>
            <strong>{organizationProfile.shortName}</strong>
            <small>Информационно-аналитическое сопровождение системы образования</small>
          </span>
        </Link>

        <HeaderNav hotline={hotline} />
        <HeaderMobileMenu hotline={hotline} />
      </div>
    </header>
  );
}
