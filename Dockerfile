FROM node:12.18.3-alpine3.9

RUN apk --update-cache upgrade

RUN apk add mysql mysql-client

RUN touch /var/run/mysqld/mysqld.sock
RUN touch /var/run/mysqld/mysqld.pid
RUN chown -R mysql:mysql /var/run/mysqld/mysqld.sock
RUN chown -R mysql:mysql /var/run/mysqld/mysqld.sock
RUN chmod -R 644 /var/run/mysqld/mysqld.sock

RUN mysqladmin -u root password july@3450


ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG PORT=3000
ENV PORT $PORT



RUN mkdir -p /usr/src/app && chown node:node /usr/src/app


USER node

WORKDIR /usr/src/app


COPY package*.json package*.json

COPY --chown=node:node package.json package*.json ./

COPY . .

EXPOSE $PORT

CMD ["npm", "start"]