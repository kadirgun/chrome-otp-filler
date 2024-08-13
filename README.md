# Chrome OTP Filler Extension

A Chrome extension that auto-fills OTP codes.

Initially appeared on

## Getting Started

### Installing

Clone this repository

```bash
git clone https://github.com/kadirgun/chrome-otp-filler.git
```

Install npm dependencies

```bash
pnpm install
```

Run

```bash
pnpm dev
```

Build

```bash
pnpm build
```

## Features

### Google Authenticator Import

You can import migration QR codes that you created in Google Authenticator. You can also export your OTP accounts as QR codes for the Google Authenticator app.

### Auto-fill

Automatically populates the extension OTP code on web pages that match the URL and CSS selector. It automatically repeats this if the OTP period (e.g. 30 seconds) has elapsed.

#### URL Patterns

You set for which URL addresses the auto-fill feature of the extension is used. If you want to associate the URL of the page you are on with an OTP account, you can right click on that page and select OTP Filler > Add URL.

#### Selector Patterns

You set which inputs the auto-fill feature of the extension will be applied to with the CSS selector. If you want to associate the input on a web page with an OTP account, you can right click on the input element and use OTP Filler > Add Selector.

### Fill Input

You can fill an input with the OTP code with Context Menu > Fill Input or the keyboard shortcut Ctrl+Q. If the web address you are at matches a URL pattern, the OTP is filled directly. If no matching OTP account is found, a modal will open for you to select an account.

### Scan QR Code

You can use Context Menu > Scan QR Code to scan the OTP QR code on a web page. This option creates an image cropping UI and you select the area with the QR code you want to scan.
If the QR code you want to scan is an image element, you can use Context Menu > Add to OTP Filler.

### Password Protection

You can encrypt the secret keys of OTP accounts with a password. The extension encrypts the secret keys with the raw version of the password you enter and generates an HMAC SHA256 hash with a randomly generated pure key so that the password you entered can be verified later.
