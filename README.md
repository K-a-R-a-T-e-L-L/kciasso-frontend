# KCIASSO Frontend

Современная frontend-версия сайта ГКУ "КЦИАССО" на Next.js App Router.

## Локальный запуск

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run start
```

## CI/CD

В проект добавлены:

- `.github/workflows/deploy.yml`
- `Dockerfile`
- `.dockerignore`

Pipeline запускается при push в `main` и `master`, а также вручную через `workflow_dispatch`.

Что делает workflow:

- устанавливает зависимости;
- проверяет сборку проекта;
- собирает Docker-образ;
- публикует образ в GHCR;
- вызывает deploy в Dokploy.

## Что нужно настроить в GitHub

Для environment `production` нужно задать:

- `vars.GHCR_NAMESPACE`
- `vars.DOKPLOY_URL`
- `secrets.DOKPLOY_API_KEY`
- `secrets.DOKPLOY_APPLICATION_ID`
