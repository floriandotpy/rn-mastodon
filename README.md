## rn-mastodon

A Mastodon client for iOS and Android built with React Native.

Note: This is an educational exercise for me in order to learn React Native. Use at your own risk.

## Setup

For general system setup, follow the guide on https://reactnative.dev/docs/environment-setup

Project setup:

```
npm install
```

Create your own config (needed for Mastodon auth).

```
cp config.example.json config.json
```

Now edit `config.json` and add your individual credential. You can retreive them from your Mastodon instance in the development setting (URL is typically: `https://<YOUR_INSTANCE.COM>/settings/applications`).

Why have these credentials? Simple: The app currently has no login flow, so I am helping myself by storing an auth token locally.

## Run

This will build the app and launch an iOS simulator by default.

```
npx react-native run-ios
```
