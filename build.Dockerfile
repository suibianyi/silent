FROM node:10 as builder
WORKDIR /muse/mpa
COPY ./ ./
RUN rm -rf node_modules && yarn && yarn run build
FROM nginx:stable
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
COPY --from=builder /muse/mpa/dist/. /usr/share/nginx/html/
EXPOSE 80