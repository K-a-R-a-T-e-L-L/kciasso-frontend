import type { DocumentGroup } from "@/shared/content/documents.types";
import DocumentCard from "@/shared/ui/DocumentCard/DocumentCard";
import cls from "./DocumentList.module.scss";

type Props = {
  groups?: DocumentGroup[];
  emptyTitle?: string;
  emptyDescription?: string;
};

export default function DocumentList({
  groups = [],
  emptyTitle = "Документы пока не добавлены",
  emptyDescription = "После подключения backend здесь появятся списки файлов, внешние ссылки и архивные материалы раздела.",
}: Props) {
  if (groups.length === 0) {
    return (
      <div className={cls.empty}>
        <p>{emptyTitle}</p>
        <span>{emptyDescription}</span>
      </div>
    );
  }

  return (
    <div className={cls.groups}>
      {groups.map((group) => (
        <section key={group.id} className={cls.group}>
          <div className={cls.heading}>
            <p>{group.title}</p>
            {group.description ? <span>{group.description}</span> : null}
          </div>
          <div className={cls.items}>
            {group.items.map((item) => (
              <DocumentCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
