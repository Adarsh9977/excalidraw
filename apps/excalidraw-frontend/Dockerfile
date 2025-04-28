
FROM node:18-alpine

WORKDIR /usr/src/app

ARG HTTP_BACKEND
ARG WS_URL
ARG DATABASE_URL

ENV HTTP_BACKEND=${HTTP_BACKEND}
ENV WS_URL=${WS_URL}
ENV DATABASE_URL=${DATABASE_URL}


RUN npm install -g pnpm

COPY ./packages ./packages
COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ./turbo.json ./turbo.json
COPY ./apps/excalidraw-frontend ./apps/excalidraw-frontend

RUN pnpm install
RUN pnpm build
EXPOSE 3000

CMD ["pnpm", "run", "start:frontend"]