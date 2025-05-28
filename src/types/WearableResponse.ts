import { Vital } from './Vital'

export interface WearableResponse {
    creationTimestamp: Date
    creatorId: string
    data: {
        patientId: string
        ppgFileToken: string
        scheduleTags: string[]
        vitals: Vital[]
    }
    groupIds: string[]
    id: string
    status?: string
    statusChangedTimestamp: Date
    updatedTimestamp?: Date
    userIds: string[]
}
