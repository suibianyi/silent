FROM nginx:stable
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
COPY ./dist/. /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80