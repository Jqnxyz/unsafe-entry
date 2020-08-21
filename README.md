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
```

Create a file, `unsafe-config.json` in the directory of the cloned project. E.g. `../unsafe-entry/unsafe-config.json`.

Contents of the file:
```json
{
	"private_key":"web/tls/use_cert_private.key",
	"public_certs":"web/tls/use_cert_only.crt"
}
```

*Change certificate paths to point to your proper certificates if deploying outside your local machine.*

*Tested on Ubuntu/debian only!* Set up the service file to allow control with `systemctl`, and start it.

```sh
sudo cp /var/www-node/unsafe-entry/unsafe-entry.service /etc/systemd/system/unsafe-entry.service; 
# This enables start on boot, useful innit?
sudo systemctl enable unsafe-entry;
# Starts up the server
sudo systemctl start unsafe-entry; 
```

Then visit `localhost:8443` on your local machine.

## Scripts
* `deploy.sh` is a basic script I use to make git deployment to an AWS instance easier, it relies on a config file `deploy-config.json`, you can add as many instances as needed as long as both `instance-ids` and `target-hosts` have the same number of entries.
* `instances.sh` also relies on `deploy-config.json` and provides a simple command for starting or stopping an AWS instance. Usage: `./instances.sh <start/stop>`.

```json
// Example deploy-config.json
{
	"instance-ids":["i-a1b2c3d4e5f6g7h8i9"],
	"target-hosts":["ubuntu@123.123.123.123"]
}
```

## Notes
* If hosting on a remote server, ensure `hrOffset` is set to account for UTC time difference. **Default is 8**.
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