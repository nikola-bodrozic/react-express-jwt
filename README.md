# React, HOC & JWT Route

Axios exchanges username and password for JWT, and makes POST call to protected route with the token in HTTP header

## Install

`yarn` to install deps

`yarn start` to start React front end

`yarn run expsvc` to start Express server

## Features

CORS headers higher order component HOC POST form POST JSON in HTTP body consume RESTful API protected by JWT NodeJS axios async await one sequential calls

## Tests

Get token

`curl -i -X POST localhost:3008/login --data 'username=mike&password=pass'`

use token to make POST request and add a user

`curl -i -X POST localhost:3008/users -H 'Accept: application/json' -H 'Authorization: Bearer <JWT>' --data 'name=curl&email=vino1@or.com'`


unprotected routes

- non existing user `curl -i localhost:3008/users/456789`
- existing user `curl -i localhost:3008/users/2`