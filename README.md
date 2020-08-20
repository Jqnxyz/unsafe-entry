# UnsafeEntry

also known as *unprotected sex*

## What is this
Tool for mocking the SafeEntry pass.

## Why
~Inhabitants of Singapore do not have free will.~
For fun.

## Feature Requests/Issues
[Create an issue](https://github.com/Jqnxyz/unsafe-entry/issues/new), provide images/screenshots if you can.

## Setup
```sh
# SSH git clone
git clone git@github.com:jqnxyz/unsafe-entry
# cd into directory
cd unsafe-entry
# Installs all dependencies
npm install
# Starts up the server
node index.js
```
Then visit `localhost:8443` on your local machine.

## Notes
* If hosting on a remote server, set `hrOffset` to an integer value to account for UTC time difference. Default is *8*.
* While `index.js` does listen on port `8080`, QR-scanning functionality may not work under an insecure connection.
* Basic self-signed TLS certificates are provided to work out-of-the-box. If you are using this outside your local machine, please use a proper certificate issued by a trusted certificate authority.

## Endpoints
Several routes (all `GET`) are defined for this;
* `/`
	Redirects to `/entry`
* `/entry`
	User interface for scanning and providing a URL.
* `/parse`
	Parses a QR-SafeEntry URL to find the venue name, returns a redirect to either `/entry` if failed or `/pass/v2` with the appropriate parameters attached.
* `/pass/v1/entry`
	Display the older SafeEntry pass with the current date and time, using the venue provided in a `?venue=` parameter. 
* `/pass/v2/entry`
	Display the newer SafeEntry pass with the current date and time, using the venue provided in a `?venue=` parameter. 

## Known Bugs
* **FIXED** `/pass` displays current date and time of the server, not client. (Though considering the use is entirely within SGP, forcing UTC+0800 is a viable option)

## Acknowledgements
* NIMIQ's QR Scanner ([License](Licenses/QR-SCANNER-LICENSE), [Repo](https://github.com/nimiq/qr-scanner))
* ExpressJS ([License](Licenses/EXPRESS-LICENSE), [Repo](https://github.com/expressjs/express))
* PugJS ([License](Licenses/PUG-LICENSE), [Repo](https://github.com/pugjs/pug))

## License
[Mozilla Public License Version 2.0 (MPL-2.0)](LICENSE.md)