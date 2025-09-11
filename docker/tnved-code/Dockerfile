FROM node:20
WORKDIR /application

# Copy global node_modules
COPY ../../node_modules /application/node_modules
# Copy local node_modules
COPY ../../src/packages/application/tnved-code/node_modules /application/build/node_modules
# Copy compiled node_modules
COPY ../../src/packages/application/tnved-code/build/node_modules /application/build/node_modules
# Copy compiles files to working directory
COPY ../../src/packages/application/tnved-code/build/src/packages/application/tnved-code /application/build
# Copy env file
COPY ../../docker/tnved-code/.env /application/build

# Set directory
WORKDIR /application/build
CMD node main.js
