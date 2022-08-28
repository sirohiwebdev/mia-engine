# MY Invitation App Backend

Backend apis for MIA Application

## Requirements

- [Node v16+](https://nodejs.org/)
- [Docker](https://www.docker.com/)

## Running

_Easily set up a local development environment with single command!_

- clone the repo
- Run `npm ci ` in the root folder
- Run `npm run dev` to run locally
- Visit [localhost:4000](http://localhost:4000/) or if using Postman grab [config](/postman).

### NGINX Configuration

Use `default.conf` for nginx config on server, we have 2 proxies in that, one for this app server and
another of caricature application [Check here for more info](https://github.com/onfratecnologies/cartoonapp_v1.1)
