# build stage
FROM node:20.10.0 AS builder
WORKDIR /build_stage
COPY . .
RUN npm install
RUN npm run build


# run stage
FROM node:20.10.0-alpine

WORKDIR /app
COPY package.json ./
RUN npm install --only=production
COPY --from=builder /build_stage/build/ .

# дефолтный порт, можно поменять при билде в докер-компоуз файле
EXPOSE 3000

CMD ["node", "index.js"]
