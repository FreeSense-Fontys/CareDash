export interface AlertTrigger {
    id: string
    groupIds: string[]
    userIds: string[]
    creatorId: string
    creationTimestamp: Date
    updateTimestamp?: Date
    status: string
    statusChangedTimestamp: Date
    data: {
        timestamp?: Date
        vital: string
        wearableId: string
        observationId: string
        value: number
    }
}
