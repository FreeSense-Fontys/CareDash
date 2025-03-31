import { useEffect } from 'react'
import exh from '../Auth'
import { Patient } from '@extrahorizon/javascript-sdk'

const Home = () => {
    const test = async () => {
        const patients = await exh.data.documents.findAll<Patient>('patient')
        console.log(patients)
    }

    useEffect(() => {
        test()
    }, [])
    return (
        <div>
            <h1>Home</h1>
        </div>
    )
}

export default Home
