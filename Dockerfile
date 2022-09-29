FROM node:16-bullseye
ENV NODE_ENV=test

WORKDIR /app

COPY ["package.json", "./"]
RUN npm install

COPY . .

# https://www.slimjet.com/chrome/google-chrome-old-version.php
RUN export DEBIAN_FRONTEND=noninteractive \
  && apt-get update \
  && apt-get install --no-install-recommends --no-install-suggests -y \
    unzip \
    gnupg \
  && curl -sL "https://dl.google.com/linux/linux_signing_key.pub" | apt-key add - \
  && curl -sL "https://www.slimjet.com/chrome/download-chrome.php?file=files%2F104.0.5112.102%2Fgoogle-chrome-stable_current_amd64.deb" > /tmp/chrome.deb \
  && apt install --no-install-recommends --no-install-suggests -y /tmp/chrome.deb \
  && apt-get autoremove --purge -y \
    unzip \
    gnupg \
  && apt-get clean \
  && rm -rf \
    /tmp/* \
    /usr/share/doc/* \
    /var/cache/* \
    /var/lib/apt/lists/* \
    /var/tmp/*

EXPOSE 8080

ENTRYPOINT [ "npm", "run" ]
CMD [ "ci:beforesuite" ]
# CMD [ "npm", "run", "start" ]
