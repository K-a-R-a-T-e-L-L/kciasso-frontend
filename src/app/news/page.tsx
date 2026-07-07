import NewsArchivePage from "@/widgets/pages/NewsArchivePage/NewsArchivePage";

type Props = {
  searchParams: Promise<{
    page?: string;
    category?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page);

  return (
    <NewsArchivePage
      page={Number.isFinite(page) && page > 0 ? page : 1}
      category={params.category}
    />
  );
}
