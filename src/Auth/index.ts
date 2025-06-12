import { createOAuth2Client } from '@extrahorizon/javascript-sdk'
import Credentials from '../config'

const exh = createOAuth2Client({
    host: Credentials.EXH_HOST || '',
    clientId: Credentials.EXH_CLIENT_ID || '',
    clientSecret: Credentials.EXH_CLIENT_SECRET || '',
})

export default exh
