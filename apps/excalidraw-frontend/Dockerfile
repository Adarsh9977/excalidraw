
FROM node:18-alpine

WORKDIR /usr/src/app

ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_WS_URL
ARG DATABASE_URL

ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL}
ENV DATABASE_URL=${DATABASE_URL}

RUN npm install -g pnpm

COPY ./packages ./packages
COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ./turbo.json ./turbo.json
COPY ./apps/excalidraw-frontend ./apps/excalidraw-frontend

RUN pnpm install
RUN pnpm db:generate

RUN pnpm build
EXPOSE 3000

CMD ["pnpm", "run", "start:frontend"]