export type HomeCarouselSlideDto = {
  id: number;
  title: string;
  subtitle: string;
  primaryUrl: string;
  secondaryUrl: string;
  imageUrl: string;
  sortOrder: number;
};

const backendUrl =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

export async function getPublicHomeCarouselSlides(): Promise<
  HomeCarouselSlideDto[] | null
> {
  try {
    const response = await fetch(`${backendUrl}/api/public/home-carousel`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = (await response.json()) as unknown;
    return Array.isArray(data) ? (data as HomeCarouselSlideDto[]) : null;
  } catch {
    return null;
  }
}
