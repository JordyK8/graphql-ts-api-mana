FROM node:18
WORKDIR /app
COPY ./dist/apps/my-application .
ENV PORT=3000
EXPOSE ${PORT}
RUN npm install --production
# dependencies that nestjs needs
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express
CMD node ./main.js