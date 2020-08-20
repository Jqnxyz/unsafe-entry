# UnsafeEntry

also known as *unprotected sex*

## What is this
Tool for mocking the SafeEntry pass.

## Why
~Inhabitants of Singapore do not have free will.~
For fun.

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
* While `index.js` does listen on port `8080`, QR-scanning functionality may not work under an insecure connection.
* Basic self-signed TLS certificates are provided to work out-of-the-box. If you are using this outside your local machine, please use a proper certificate issued by a trusted certificate authority.

## Acknowledgements
* NIMIQ's QR Scanner ([License](Licenses/QR-SCANNER-LICENSE), [Repo](https://github.com/nimiq/qr-scanner))
* ExpressJS ([License](Licenses/EXPRESS-LICENSE), [Repo](https://github.com/expressjs/express))
* PugJS ([License](Licenses/PUG-LICENSE), [Repo](https://github.com/pugjs/pug))

## License
[Mozilla Public License Version 2.0 (MPL-2.0)](LICENSE.md)