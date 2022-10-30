FROM node:16-alpine as build
RUN npm i pnpm -g
WORKDIR /app
COPY . .
RUN pnpm i
RUN pnpm run build

FROM nginx:stable-alpine
COPY ../default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

