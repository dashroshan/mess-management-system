# Setup Guide

Create a `config.env` file with the below content and place it inside the `config` directory containing `passport.js`

```
# Port where the server should run
PORT = 4000

# For redirection after authentication
FRONTEND = http://localhost:4000

# MongoDB url
MONGO_URI = mongodb+srv://{user}:{pass}@xxxx.xxxx.mongodb.net/mess

# From google API console
GOOGLE_CLIENT_ID = xxxx-xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = xxxx-xxxx_xxxx_xxxx

# Call back url set in API console
CALLBACK_URL = /api/auth/google/callback

# Razorpay Details
PAY_ID = rzp_test_xxxx
PAY_SECRET = xxxx

# Admin GMail ID
ADMIN = user@gmail.com
```

Open the project folder in command prompt and run:

1. `npm install` once
2. `npm run start` to run the portal
