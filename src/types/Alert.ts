export interface Alert {
    id: string
    data: {
        vital: string
        alertType: 'Above' | 'Below'
        threshold: number
        wearableId: string
        patientId?: string
        carepathId: string
    }
}
