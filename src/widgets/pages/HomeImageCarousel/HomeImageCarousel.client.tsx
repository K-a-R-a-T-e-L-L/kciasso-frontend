"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Anchor,
  Box,
  Button,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import { useReducedMotion } from "@mantine/hooks";
import Autoplay from "embla-carousel-autoplay";
import { IconArrowRight } from "@tabler/icons-react";
import Container from "@/shared/ui/Container/Container";

export type HomeSlide = {
  id: string | number;
  imageSrc: string;
  title: string;
  description?: string;
  primaryHref: string;
  secondaryHref: string;
};

export const HOME_SLIDES: HomeSlide[] = [
  {
    id: "news",
    imageSrc: "/images/home-slider/slide-1.svg",
    title: "Новости образования региона",
    description: "Актуальные события, объявления и важные даты.",
    primaryHref: "/news",
    secondaryHref: "/news",
  },
  {
    id: "gia",
    imageSrc: "/images/home-slider/slide-2.svg",
    title: "Всё о ГИА в одном месте",
    description: "Документы, сроки, результаты и полезные материалы.",
    primaryHref: "/gia",
    secondaryHref: "/gia",
  },
  {
    id: "resources",
    imageSrc: "/images/home-slider/slide-3.svg",
    title: "Полезные ресурсы",
    description: "Проверенные сервисы для учеников, родителей и педагогов.",
    primaryHref: "/resources",
    secondaryHref: "/resources",
  },
  {
    id: "about",
    imageSrc: "/images/home-slider/slide-4.svg",
    title: "О центре",
    description: "Направления работы, контакты и открытая информация.",
    primaryHref: "/o-centre",
    secondaryHref: "/o-centre",
  },
];

export default function HomeImageCarousel({
  slides = HOME_SLIDES,
}: {
  slides?: HomeSlide[];
}) {
  const reducedMotion = useReducedMotion();
  const [autoplay] = useState(() =>
    Autoplay({ delay: 5500, stopOnInteraction: false, stopOnMouseEnter: true }),
  );

  if (slides.length === 0) return null;

  return (
    <Box
      component="section"
      aria-label="Основные разделы сайта"
      py={{ base: "md", sm: "xl" }}
    >
      <Container data-home-carousel-container>
        <Carousel
          withIndicators
          plugins={reducedMotion ? [] : [autoplay]}
          onMouseEnter={() => autoplay.stop()}
          onMouseLeave={() => {
            if (!reducedMotion) autoplay.play();
          }}
          onFocusCapture={() => autoplay.stop()}
          onBlurCapture={() => {
            if (!reducedMotion) autoplay.play();
          }}
          slideGap="md"
          emblaOptions={{ align: "start", loop: true }}
          aria-label="Карусель разделов"
        >
          {slides.map((slide) => (
            <CarouselSlide key={slide.id}>
              <Paper
                pos="relative"
                h={{ base: 330, sm: 440 }}
                radius="xl"
                shadow="md"
                withBorder
                style={{ overflow: "hidden" }}
              >
                <Image
                  src={slide.imageSrc}
                  alt=""
                  h="100%"
                  w="100%"
                  fit="cover"
                />
                <Box
                  pos="absolute"
                  inset={0}
                  bg="linear-gradient(90deg, rgba(3,29,67,.92) 0%, rgba(3,29,67,.68) 52%, rgba(3,29,67,.08) 100%)"
                />
                <Stack
                  pos="absolute"
                  left={{ base: 24, sm: 56 }}
                  right={{ base: 24, sm: "48%" }}
                  bottom={{ base: 36, sm: 56 }}
                  gap="md"
                  c="white"
                >
                  <Title order={2} size="clamp(1.8rem, 4vw, 3.4rem)" lh={1.05}>
                    {slide.title}
                  </Title>
                  {slide.description ? (
                    <Text size="lg" c="gray.1" maw={620}>
                      {slide.description}
                    </Text>
                  ) : null}
                  <Group>
                    <Button
                      component={Link}
                      href={slide.primaryHref}
                      size="md"
                      color="kciassoTeal"
                      rightSection={<IconArrowRight size={18} />}
                    >
                      Перейти
                    </Button>
                    <Anchor
                      component={Link}
                      href={slide.secondaryHref}
                      c="white"
                      fw={700}
                    >
                      Подробнее
                    </Anchor>
                  </Group>
                </Stack>
              </Paper>
            </CarouselSlide>
          ))}
        </Carousel>
      </Container>
    </Box>
  );
}
