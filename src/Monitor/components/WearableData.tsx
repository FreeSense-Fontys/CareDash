import { useEffect, useState } from "react";
import exh from "../../Auth";
import { Patient } from "@extrahorizon/javascript-sdk";

interface wearableDataProps {
    patients: Patient[],
    indexPatient: any
}

const WearableData = ({ patients, indexPatient }: wearableDataProps) => {

    const [wearables, setWearableData] = useState<any>([]);

    // async function getWearableData() {
    //     const wearableID = patients[0]?.data?.coupledWearables[0]?.wearableId;
    //     const date = "2025-04-02";
    //     await exh.tasks.api.get(
    //         "get-observations-by-day", "?wearableId=" + wearableID + "&date=" + date, {}
    //     ).then(result => {
    //         setWearableData(result);
    //     });
    // }
    // //console.log(wearables);

    // useEffect(() => {
    //     getWearableData()
    // }, []);


    useEffect(() =>{
        const getWearable = async (indexPatient) => {
            const wearableID = patients[indexPatient]?.data?.coupledWearables[0]?.wearableId;
            console.log("ID ", wearableID)
            const date = "2025-04-02";
            await exh.tasks.api.get(
                "get-observations-by-day", "?wearableId=" + wearableID + "&date=" + date, {}
            ).then(
                result => {setWearableData(result)}
            )
    
        } 
        getWearable(indexPatient)
    }, []);

    if(!wearables){
        return (<></>)
    }
    console.log("Wearables: ", wearables)

    return (
        <>
            {wearables.map((wearable) => (
                wearable.vitals.map((vital, index) => (
                    <div className="flex justify-around gap-5">
                        {/* HR */}
                        {vital.data.HR == "" || vital.data.HR == null ? (
                            <div className="flex justify-center items-center"><div className="text-center size-12 rounded-lg justify-center items-center flex"></div></div>
                        ) : (
                            <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center items-center flex leading-tight">{vital.HR}</div></div>
                        )}
                        {/* BP */}
                        {vital.BP == "" || vital.BP == null ? (
                            <div className="flex justify-center items-center"><div className="text-center size-12 rounded-lg justify-center items-center flex"></div></div>
                        ) : (
                            <div className="flex justify-center items-center"><div className="text-center border size-12 p-2 rounded-lg justify-center items-center flex leading-tight">{vital.BP}</div></div>)
                        }
                        {/* SPO2 */}
                        {vital.SPO2 == "" || vital.SPO2 == null ? (
                            <div className="flex justify-center items-center"><div className="text-center size-12 rounded-lg justify-center items-center flex"></div></div>
                        ) : (
                            <div className="flex justify-center items-center"><div className="text-center border size-12 p-2 rounded-lg justify-center items-center flex leading-tight">{vital.SPO2}</div></div>)
                        }
                        {/* RR */}
                        {vital.RR == "" || vital.RR == null ? (
                            <div className="flex justify-center items-center"><div className="text-center size-12 rounded-lg justify-center items-center flex"></div></div>
                        ) : (
                            <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center items-center flex leading-tight">{vital.RR}</div></div>
                        )}
                        {/* ACT */}
                        {vital.ACT == "" || vital.ACT == null ? (
                            <div className="flex justify-center items-center"><div className="text-center size-12 rounded-lg justify-center items-center flex"></div></div>
                        ) : (
                            <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center items-center flex leading-tight">{vital.ACT}</div></div>
                        )}
                        {/* T */}
                        {vital.T == "" || vital.T == null ? (
                            <div className="flex justify-center items-center"><div className="text-center size-12 rounded-lg justify-center items-center flex"></div></div>
                        ) : (
                            <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center items-center flex leading-tight">{vital.T}</div></div>
                        )}

                        {/* Checkbox */}
                        < div className="flex justify-around" >
                            <input type="checkbox" className="w-6 h-6 rounded border-gray-300 focus:ring-blue-500 mr-5 " />
                        </div>

                    </div>

                )
                )
            ))}
        </>
    )

}
export default WearableData