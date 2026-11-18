FROM nginx:1.31.9-alpine
COPY . /usr/share/nginx/html
RUN rm -f /usr/share/nginx/html/Dockerfile
EXPOSE 80
