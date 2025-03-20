declare global {
    namespace NodeJS {
        interface ProcessEnv {
            REACT_APP_EXH_HOST: string
            REACT_APP_EXH_CLIENT_ID: string
            REACT_APP_EXH_CLIENT_SECRET: string
            REACT_APP_EXH_CLIENT_USERNAME: string
            REACT_APP_EXH_CLIENT_PASSWORD: string
        }
    }
}

export {}
