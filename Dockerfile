# syntax=docker/dockerfile:1

ARG NODE_VERSION=23.11.0
ARG PNPM_VERSION=10.1.0

FROM node:${NODE_VERSION}-slim AS base

WORKDIR /usr/src/app

RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

FROM base AS deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile

FROM deps AS build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM base AS final

ENV NODE_ENV=production

RUN mkdir -p /usr/src/app && \
    chown -R node:node /usr/src/app

USER node

COPY package.json ./

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/bin ./bin

CMD ["bin/cli.mjs"]
