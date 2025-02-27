import {generateUrl} from "../utils/urlBuilder.js"
import {Location} from "./entities/Location.ts";

const URL_ANALYTICS = 'http://localhost:8084/API/analytics'

async function GetAverageJobOfferValue(){
    const response = await fetch(
        generateUrl(`${URL_ANALYTICS}/JobOfferValue`), {
            method: 'GET',
            credentials: 'include'
        }
    )

    const obj = await response.json()

    if (response.ok) {
        return obj
    } else {
        throw obj
    }
}

async function GetAverageJobOfferDuration(){
    const response = await fetch(
        generateUrl(`${URL_ANALYTICS}/JobOfferDuration`), {
            method: 'GET',
            credentials: 'include'
        }
    )

    const obj = await response.json()

    if (response.ok) {
        return obj
    } else {
        throw obj
    }
}

async function GetLocationsList(numLocations = 1){
    const response = await fetch(
        generateUrl(`${URL_ANALYTICS}/locations`, {numLocations}), {
            method: 'GET',
            credentials: 'include'
        }
    )

    const obj = await response.json()

    if (response.ok) {
        return obj.map((e) => Location.fromJsonObject(e))
    } else {
        throw obj
    }
}


const AnalyticsAPI = {
    GetAverageJobOfferValue,
    GetAverageJobOfferDuration,
    GetLocationsList,
}

export default AnalyticsAPI
