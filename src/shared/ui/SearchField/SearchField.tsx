"use client";

import { IconSearch, IconX } from "@tabler/icons-react";
import cls from "./SearchField.module.scss";

export type SearchFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
  id?: string;
};

export default function SearchField({ label, value, onChange, placeholder, resultCount, id }: SearchFieldProps) {
  return (
    <label className={cls.label} htmlFor={id}>
      <span className={cls.labelText}>{label}</span>
      <span className={cls.field}>
        <IconSearch size={20} stroke={1.8} aria-hidden="true" />
        <input id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
        {value ? (
          <button type="button" className={cls.clear} aria-label="Очистить поиск" onClick={() => onChange("")}>
            <IconX size={18} stroke={1.8} aria-hidden="true" />
          </button>
        ) : null}
      </span>
      {resultCount !== undefined ? <output className={cls.count} aria-live="polite">Найдено: {resultCount}</output> : null}
    </label>
  );
}
