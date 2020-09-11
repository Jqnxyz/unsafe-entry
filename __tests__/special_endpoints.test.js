/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
const app = require('../main_server.js')
const supertest = require('supertest')
const request = supertest(app)

// /Parse
it('Testing parse endpoint', async done => {
    const seUrl = "https://temperaturepass.ndi-api.gov.sg/login/PROD-T16MC0110C-JUNCTIONNINE-SE"    
    const res = await request.get('/parse?seUrl=' + encodeURIComponent(seUrl))
    expect(res.status).toBe(302);
    done()
})
