## first command is for build package manager
FROM node:22-alpine AS build

#working directory for build
WORKDIR /app 

#copy package from source to destination
COPY package*.json ./ 

#install dependencies
RUN npm install

#copying
COPY . .

RUN npx vite build

## Runtime stage

FROM nginx:alpine
WORKDIR /app
COPY --from=build /app/dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

##nginx has its on built in auto start




#Docker caches each layer and images are built layer on layer.So the above steps which are not changed will not be re-executed causing bloating of our image and the layer which will have frequent changes are at the bottom.
