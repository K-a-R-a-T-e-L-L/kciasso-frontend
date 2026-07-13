"use client";

import { useActionState, useState } from "react";
import type { AdminSiteSettingsFormData, AdminSiteSettingsFormState } from "./AdminSiteSettingsForm.types";
import { adminSiteSettingsFormInitialState } from "./AdminSiteSettingsForm.types";
import cls from "./AdminSiteSettingsForm.module.scss";

const sectionLabels = {
  "home.quick-access": "Быстрый доступ",
  "home.resources": "Важные ресурсы",
  "home.gia-reference": "ГИА",
  "home.official-resources": "Официальные ресурсы",
} as const;

type Props = {
  initialData: AdminSiteSettingsFormData;
  action: (state: AdminSiteSettingsFormState, formData: FormData) => Promise<AdminSiteSettingsFormState>;
};

export default function AdminSiteSettingsForm({ initialData, action }: Props) {
  const [state, formAction, pending] = useActionState(action, adminSiteSettingsFormInitialState);
  const [order, setOrder] = useState(initialData.homeSectionsOrder);

  function move(index: number, offset: -1 | 1) {
    const nextIndex = index + offset;
    if (nextIndex < 0 || nextIndex >= order.length) return;
    setOrder((current) => {
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  return (
    <form className={cls.form} action={formAction}>
      <div className={cls.grid}>
        <label className={cls.field}>
          <span>Горячая линия ГИА</span>
          <input type="text" name="giaHotlinePhone" defaultValue={initialData.giaHotlinePhone} required />
          <small>Отображается в header, mobile menu, контактных блоках и на странице контактов.</small>
        </label>

        <label className={cls.field}>
          <span>Телефон для справок</span>
          <input type="text" name="informationPhone" defaultValue={initialData.informationPhone} required />
          <small>Используется в блоках справочной информации и footer.</small>
        </label>

        <label className={cls.field}>
          <span>Телефон доверия ЕГЭ</span>
          <input type="text" name="egeTrustPhone" defaultValue={initialData.egeTrustPhone} required />
          <small>Используется в публичных контактных списках.</small>
        </label>

        <label className={cls.field}>
          <span>Электронная почта</span>
          <input type="email" name="email" defaultValue={initialData.email} required />
          <small>Формирует `mailto:` ссылки на публичной части сайта.</small>
        </label>
      </div>

      <fieldset className={cls.orderBlock}>
        <legend>Порядок секций главной страницы</legend>
        <p>Настройте порядок информационных блоков. Первый экран и контактный блок остаются на фиксированных местах.</p>
        <div className={cls.orderList}>
          {order.map((key, index) => (
            <div className={cls.orderItem} key={key}>
              <span className={cls.orderNumber}>{index + 1}</span>
              <strong>{sectionLabels[key]}</strong>
              <input type="hidden" name="homeSectionsOrder" value={key} />
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Переместить «${sectionLabels[key]}» вверх`}>
                Вверх
              </button>
              <button type="button" onClick={() => move(index, 1)} disabled={index === order.length - 1} aria-label={`Переместить «${sectionLabels[key]}» вниз`}>
                Вниз
              </button>
            </div>
          ))}
        </div>
      </fieldset>

      {state.error ? <p role="alert" className={`${cls.message} ${cls.error}`}>{state.error}</p> : null}
      {state.success ? <p role="status" className={`${cls.message} ${cls.success}`}>{state.success}</p> : null}

      <div className={cls.actions}>
        <button type="submit" disabled={pending}>
          {pending ? "Сохранение..." : "Сохранить настройки"}
        </button>
      </div>
    </form>
  );
}
