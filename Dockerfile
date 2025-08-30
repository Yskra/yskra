FROM nginx:alpine

RUN apk --no-cache add fcgiwrap jq spawn-fcgi

COPY nginx.conf /etc/nginx/nginx.conf
COPY scripts/generate_manifest.sh /app/generate_manifest.sh
COPY scripts/container_entrypoint.sh /start.sh

COPY dist /app
COPY dist/config.container.json /app/config.json

RUN chmod +x /start.sh && \
    chmod +x /app/generate_manifest.sh

EXPOSE 80

CMD ["/start.sh"]
