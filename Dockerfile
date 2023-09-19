FROM debian:buster-slim as builder
LABEL maintainer="ux@blockstack.com"

ARG NODE_VERSION=12
ENV WALLET_ENVIRONMENT="production"
ENV NODE_VERSION=${NODE_VERSION}
WORKDIR /src


COPY . .
RUN apt-get update -y \
    && apt-get install -y build-essential python3 zip curl git \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg |  apt-key add - \
    && curl -sL https://deb.nodesource.com/setup_${NODE_VERSION:-12}.x | bash - \
    && sh -c 'echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list' \
    && apt-get update -y \
    && apt-get install -y yarn nodejs \
    && chmod +x build-ext.sh \
    && yarn \
    && yarn build \
    && ./build-ext.sh /leather-chromium.zip


FROM alpine:3.16
COPY --from=builder /leather-chromium.zip .

# Wait for extension.zip to be copied into local
CMD sleep 30
