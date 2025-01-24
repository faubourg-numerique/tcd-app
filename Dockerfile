FROM php:8.1-apache

COPY ./000-default.conf /etc/apache2/sites-available/000-default.conf

COPY ./dist /var/www/html

RUN a2enmod rewrite && \
    chown www-data:www-data -R /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]
