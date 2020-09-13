# UnsafeEntry

## Web service to mimic SafeEntry passes.
[![Maintainability](https://api.codeclimate.com/v1/badges/1ce8c042ffecebc073ba/maintainability)](https://codeclimate.com/github/Jqnxyz/unsafe-entry/maintainability)
[![Last Commit](https://badgen.net/github/last-commit/jqnxyz/unsafe-entry)]()
[![Run Status](https://api.shippable.com/projects/5f4163513d3f9800071fc2c7/badge?branch=master)]()
[![Node JS CI](https://github.com/jqnxyz/unsafe-entry/workflows/Node.js%20CI/badge.svg)]()
## Why
While SafeEntry is a good concept for contact tracing efforts, the implementation leaves much to be desired.

With the normalisation of SafeEntry, many users essentially have their freedom of movement limited if they decide that they want to maintain control of their privacy.

This paves the way for a dangerous possibility where analysis of such a massive collection of location data could be done with possible malicious intent (e.g. prediction of individual movements through pattern analysis).

### How it could be better
Much like how the Exposure Notification system works, we could ,*instead* of centralising the movements of **all** users, centralise the movements of those who have been **infected**.

This allows SafeEntry to store the users' movements locally, checking against the central database to see if any of the venue visitation periods recorded by the *infected* users coincides with any of the local users' recorded movements.

This way, all infected peoples' records could be uploaded anonymously, and the user does not have their movement data collected until they are proven to be infected.

### Downsides to this workaround

* You won't be able to be contacted through SafeEntry tracing methods if you've been exposed to an infected patient.

* You won't be able to contribute past movements to SafeEntry if you decide to switch back to using SafeEntry.
	* A workaround to this is to either manually record your visits and/or leave Google's location history feature on to provide data to MOH if you are infected.

### Project lifetime
Until users are given the choice to withhold their data, or a privacy-preserving solution is presented and implemented, this project will continue to provide a workaround for those who seek such choices.

## Feature Requests/Issues
[Create an issue](https://github.com/Jqnxyz/unsafe-entry/issues/new), provide images/screenshots if you can.

## Setup
### Initialising
```sh
# SSH git clone
git clone git@github.com:jqnxyz/unsafe-entry
# cd into directory
cd unsafe-entry
# Installs all dependencies
npm install
```

### Configuration
Rename `unsafe-config.json.example` to `unsafe-config.json`. Edit the configuration as needed.

*Ensure to change certificate paths to point to a trusted CA-issued certificate pair if deploying outside your local machine.*

### Development
* Create a branch or a fork to commit changes to.
* All tests should be placed in `__tests__/`
* Run tests using `npm run test` or `npm run test:watch`
* Commits directly to `master` should only be done in emergencies. Otherwise, create a pull request.

### Running the server
Start the server with `node index.js`

Then visit `localhost:8443` on your local machine.

#### Service file
*Tested on Ubuntu/debian only!*

Instead of using a command to start the server, a service file can make deployment easier.

Set up the service file `unsafe-entry.service` to allow control with `systemctl`, and start it.

*Change the source path below to where the cloned repo resides.*

```sh
sudo cp /path/to/unsafe-entry.service /etc/systemd/system/unsafe-entry.service; 
# This enables start on boot, useful innit?
sudo systemctl enable unsafe-entry;
# Starts up the server
sudo systemctl start unsafe-entry; 
```

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
* `/qr `
Instantly launches the QR scanning frame for quick scanning.
* `/se/qr`
Launches the QR scanning frame that submits through the official SafeEntry API.
* `/se/config`
Configures the data sent to SafeEntry for `/se/*` endpoints. Utilises localstorage.
* `/parse`
Parses a QR-SafeEntry URL to find the venue name, returns a redirect to either `/entry` if failed or `/pass/v2` with the appropriate parameters attached.
* `/pass/v1/entry`
Display the older SafeEntry pass with the current date and time, using the venue provided in a `?venue=` parameter.
* `/pass/v2/entry`
Display the newer SafeEntry pass with the current date and time, using the venue provided in a `?venue=` parameter.

## Acknowledgements
* NIMIQ's QR Scanner ([License](Licenses/QR-SCANNER-LICENSE), [Repo](https://github.com/nimiq/qr-scanner))
* ExpressJS ([License](Licenses/EXPRESS-LICENSE), [Repo](https://github.com/expressjs/express))
* PugJS ([License](Licenses/PUG-LICENSE), [Repo](https://github.com/pugjs/pug))

## License
* All source code, unless specified otherwise, is licensed under the [Mozilla Public License Version 2.0 (MPL-2.0)](LICENSE.md).
* All `.svg` files in `web/assets/images` and `web/assets/favicon.svg` are not covered by the above license(s).