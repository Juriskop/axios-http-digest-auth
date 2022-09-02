# SWISH-Client

This library exports a client which can be used to query the SWISH API and even allows using HTTP Digest Auth.

## How to Use

```typescript
import axios from "axios";

// Setup
const axiosInstance = axios.create({});
httpDigestAuth(this.axiosInstance, {username: 'Your Username', password: 'Your Password'});

// Use it as you would a normal axios instance
axiosInstance.get('https://example.com/program.pl?format=json');
```


## Dev Setup

```bash
# Install yarn if not installed (npm/node is required)
npm install --global yarn

# Position yourself in the directory in which you wanna put this library and it's dependency @juriskop/swish-node-digest-auth and then run these commands
git clone https://github.com/Juriskop/SWISH-Client.git
git clone https://github.com/Juriskop/axios-http-digest-auth.git

# Setting up @juriskop/swish-node-digest-auth
cd swish-node-digest-auth

yarn install
yarn run build
yarn link

cd ..

# Setting up this project
cd axios-http-digest-auth

yarn install
yarn link @juriskop/swish-node-digest-auth

# Optional for running the provided tests; Replace values appropriately
cp env.example. .env
```

## More commands

```bash
# Running tests
yarn run test 

# Building to project (to the dist folder)
yarn run build
```