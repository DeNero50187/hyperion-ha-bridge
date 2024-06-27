ARG BUILD_FROM
FROM $BUILD_FROM

RUN \
  apk add --no-cache \
    npm

COPY package.json /
COPY package-lock.json /
RUN npm ci
COPY . /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
