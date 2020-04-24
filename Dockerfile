ARG NODE_IMAGE=node:lts-alpine

# build stage
FROM $NODE_IMAGE as build-stage
WORKDIR /app
COPY package.json yarn.lock .env ./
RUN yarn install
COPY . .
RUN yarn run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY .env /usr/share/nginx/html/.env
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
