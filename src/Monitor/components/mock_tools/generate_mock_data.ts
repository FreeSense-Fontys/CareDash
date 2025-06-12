import { EXAMPLE_DATA, interpolateBloodPressure } from './mock_bp'
import { generateHeartRateSignal, randomizeHR } from './mock_hr'
import { convertTimeToISO } from './utils'
import { generateTemperatureSignal } from './mock_T'
import exh from '../../../Auth'

async function defaultGenerator(
    generateForDate: string,
    // carepaths: Map<string, number>,
    interval: number = 5,
    start: string = '00:00',
    stop: string = '23:59',
    fever?: { start: string }
) {
    const temperature = generateTemperatureSignal(start, stop, interval, fever)
    const heartRateSignal = randomizeHR(start, stop, interval)
    const bloodpressure = interpolateBloodPressure(
        EXAMPLE_DATA,
        start,
        stop,
        interval
    )

    const timeDiffOptions = ['01', '03', '05', '09']

    for (let index = 0; index < heartRateSignal.length; index++) {
        // const carepathsIter: string[] = []
        // carepaths.forEach((interval, key) => {
        //     if (index % interval === 0) {
        //         carepathsIter.push(key) // Add the key to the list if the condition is met
        //     }
        // })
        const HR = heartRateSignal[index]
        const BP = bloodpressure[index] // interpolation does not extend to (24:00)
        const T = temperature[index]

        // Some variation in timings for testing purposes
        const timeDiffS =
            timeDiffOptions[Math.floor(Math.random() * timeDiffOptions.length)]
        const timeDiffMoptions = [0, 1, 2]
        const timeDiffM =
            timeDiffMoptions[
                Math.floor(Math.random() * timeDiffMoptions.length)
            ]
        const timeDiffMprocessed =
            parseInt(HR.time.substring(0, 2)) >= 23
                ? '00'
                : (timeDiffM + parseInt(HR.time.substring(3, 5)))
                      .toString()
                      .padStart(2, '0')

        const measurement: {
            vitals: {
                name: string
                value: number
                sqiStatus: number
                timestamp: string
            }[]
            scheduleTags: string[]
            ppgFileToken: string
        } = {
            vitals: [],
            // scheduleTags: carepathsIter,
            scheduleTags: ['COPD'],
            ppgFileToken: '',
        }

        if (HR) {
            measurement.vitals.push({
                name: 'HR',
                value: HR.HR,
                sqiStatus: 1,
                timestamp: convertTimeToISO(
                    generateForDate,
                    `${HR.time.substring(0, 2)}:${timeDiffMprocessed}`
                ),
            })
        }
        if (BP) {
            measurement.vitals.push({
                name: 'SBP',
                value: BP.SBP,
                sqiStatus: 1,
                timestamp: convertTimeToISO(generateForDate, BP.time),
            })
            measurement.vitals.push({
                name: 'DBP',
                value: BP.DBP,
                sqiStatus: 1,
                timestamp: convertTimeToISO(generateForDate, BP.time),
            })
        }

        if (T) {
            measurement.vitals.push({
                name: 'T',
                value: T.T,
                sqiStatus: 1,
                timestamp: convertTimeToISO(generateForDate, T.time),
            })
        }
        const post = await exh.data.documents.create(
            'wearable-observation',
            measurement
        )
    }
    console.log(await exh.users.me())
    console.log('Success!')
}

export default defaultGenerator
