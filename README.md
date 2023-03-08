# SWISH-Client

This library exports a client which can be used to query the SWISH API and even allows using HTTP Digest Auth. This Digest Auth implementation is only tested against SWISH and only supports one specification case (qop = auth; MD5 hash).

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
# Optional for running the provided tests; Replace values appropriately
cp env.example. .env
```

## More commands

```bash
# Running tests
npm run test 

# Building to project (to the dist folder)
npm run build
```