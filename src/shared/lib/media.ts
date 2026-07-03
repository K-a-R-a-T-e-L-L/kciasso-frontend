export const MEDIA = {
  logo: "/logo.png",
  fallbackPattern: "/images/ocmko/hero-pattern.webp",
  // После подключения реальных файлов можно добавить сюда конкретные изображения.
  // Компоненты не должны напрямую импортировать public assets.
  images: {
    center: "/images/ocmko/center.webp",
    education: "/images/ocmko/education.webp"
  }
} as const;
