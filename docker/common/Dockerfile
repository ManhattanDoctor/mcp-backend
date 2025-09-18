FROM node:20
WORKDIR /application

# Copy global node_modules
COPY ../../node_modules /application/node_modules
# Copy local node_modules
COPY ../../src/packages/application/common/node_modules /application/build/node_modules
# Copy compiled node_modules
COPY ../../src/packages/application/common/build/node_modules /application/build/node_modules
# Copy compiles files to working directory
COPY ../../src/packages/application/common/build/src/packages/application/common /application/build
# Copy env file
COPY ../../docker/common/.env /application/build

# Set directory
WORKDIR /application/build
CMD node main.js
