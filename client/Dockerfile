FROM node:14.5
RUN npm install -g serve

RUN adduser app

COPY . /home/app
WORKDIR /home/app
RUN chown -R app:app /home/app

USER app
RUN yarn install
RUN yarn build
CMD serve -s build -l 3000
