# God's Eye View is designed to run as `vite dev` in production — its API
# provider proxies (server/providers/*) are Vite middleware plugins that only
# attach in dev mode, not in `vite preview`. Exposing beyond localhost is an
# explicitly supported path (README: "To share on your LAN, opt in
# explicitly"); this container does the same thing, reachable only via
# Tailscale + Coolify's reverse proxy rather than the LAN.
FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV HOST=0.0.0.0
ENV PORT=4173
EXPOSE 4173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "4173"]
