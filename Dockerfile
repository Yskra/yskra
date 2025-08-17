FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY dist /app
COPY dist/config.container.json /app/config.json

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
