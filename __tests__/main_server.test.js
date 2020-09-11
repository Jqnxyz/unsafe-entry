/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
const app = require('../main_server.js')
const supertest = require('supertest')
const request = supertest(app)

const basicUniqueEndpoints = ['/entry', '/qr'];
const redirect302Endpoints = ['/'];

redirect302Endpoints.forEach( function(element, index) {
  it('Testing 302 endpoint ' + element, async done => {
    const res = await request.get(element)
    expect(res.status).toBe(302);
    done()
  })
});

basicUniqueEndpoints.forEach( function(element, index) {
  it('Testing basic endpoint ' + element, async done => {
    const res = await request.get(element)
    expect(res.status).toBe(200);
    done()
  })
});

const passEntryVersions = ['v1', 'v2'];

passEntryVersions.forEach( function(element, index) {
  it('Testing pass entry endpoint ' + element, async done => {
    const res = await request.get('/pass/' + element + '/entry')
    expect(res.status).toBe(200);
    done()
  })
});


it('Testing parse endpoint', async done => {
	const seUrl = "https://temperaturepass.ndi-api.gov.sg/login/PROD-T16MC0110C-JUNCTIONNINE-SE"	
  	const res = await request.get('/parse?seUrl=' + encodeURIComponent(seUrl))
  	expect(res.status).toBe(302);
    done()
})
