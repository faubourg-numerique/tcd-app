FROM php:8.1-apache

WORKDIR /home/apache

COPY . .

COPY ./000-default.conf /etc/apache2/sites-available/000-default.conf

RUN apt-get update -y && \
    apt-get install -y nodejs npm && \
    npm install && \
    npm run build-only && \
    a2enmod rewrite && \
    cp -r -T ./dist /var/www/html && \
    chown www-data:www-data -R /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]
