import { Patient } from '@extrahorizon/javascript-sdk'

import { CoupledWearable } from './CoupledWearable'

export interface PatientResponse extends Patient {
    data: {
        birthDate: string
        coupledWearables: CoupledWearable[]
        email: string
        gender: string
        language: string
        name: string
        phoneNumber: string
    }
    status: string
    carepaths: Array<{ name: string }>
    checked?: boolean
    bmi?: string
    birthDate?: string
    skinType?: string
}
