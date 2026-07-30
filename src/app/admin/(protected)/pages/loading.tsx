import { Box } from "@mantine/core";

export default function Loading() {
  return <Box className={""} aria-label="Загрузка страниц">{Array.from({ length: 6 }, (_, index) => <Box className={""} key={index} />)}</Box>;
}
