import { createOAuth2Client } from '@extrahorizon/javascript-sdk'
import Credentials from '../config'

const exh = createOAuth2Client({
    host: Credentials.EXH_HOST || '',
    clientId: Credentials.EXH_CLIENT_ID || '',
    clientSecret: Credentials.EXH_CLIENT_SECRET || '',
})

// this created bug where it was logging into fontys each time exh instance is created
// async function authenticate() {
//     await exh.auth.authenticate({
//         username: Credentials.EXH_CLIENT_USERNAME || '',
//         password: Credentials.EXH_CLIENT_PASSWORD || '',
//     })
// }

// authenticate()

export default exh
