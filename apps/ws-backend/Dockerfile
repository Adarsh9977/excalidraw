FROM node:18-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm
COPY ./packages ./packages
COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ./turbo.json ./turbo.json
COPY ./apps/ws-backend ./apps/ws-backend
RUN pnpm install
RUN pnpm db:generate
RUN pnpm build
EXPOSE 8080 
CMD ["pnpm", "run", "start:ws-backend"]