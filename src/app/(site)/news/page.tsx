import NewsArchivePage from "@/widgets/pages/NewsArchivePage/NewsArchivePage";

type Props = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    category?: string;
    search?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page);
  const limit = Number(params.limit);

  return (
    <NewsArchivePage
      page={Number.isFinite(page) && page > 0 ? page : 1}
      limit={Number.isFinite(limit) && limit > 0 ? limit : undefined}
      category={params.category}
      search={params.search}
    />
  );
}
