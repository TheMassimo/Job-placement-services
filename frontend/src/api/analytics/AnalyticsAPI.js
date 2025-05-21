import {generateUrl} from "../utils/urlBuilder.js"
import {Location} from "./entities/Location.ts";

const URL_ANALYTICS = 'http://localhost:8080/service_analytics/API/analytics'

async function GetAverageJobOfferValue(xsrfToken){
    const response = await fetch(
        generateUrl(`${URL_ANALYTICS}/JobOfferValue`), {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken}
        }
    )

    const obj = await response.json()

    if (response.ok) {
        return obj
    } else {
        throw obj
    }
}

async function GetAverageJobOfferDuration(xsrfToken){
    const response = await fetch(
        generateUrl(`${URL_ANALYTICS}/JobOfferDuration`), {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken}
        }
    )

    const obj = await response.json()

    if (response.ok) {
        return obj
    } else {
        throw obj
    }
}

async function GetMinMaxJobOfferValue(xsrfToken){
    const response = await fetch(
        generateUrl(`${URL_ANALYTICS}/JobOfferMinMax`), {
            method: 'GET',
            credentials: 'include',
            headers: {'X-XSRF-TOKEN': xsrfToken}
        }
    )

    const obj = await response.json()

    if (response.ok) {
        return obj
    } else {
        throw obj
    }
}

async function GetAverageJobOfferMonthlyValue(xsrfToken){
    const response = await fetch(
        generateUrl(`${URL_ANALYTICS}/JobOfferMonthValue`), {
            method: 'GET',
            credentials: 'include',
            headers: {'X-XSRF-TOKEN': xsrfToken}
        }
    )

    const obj = await response.json()

    if (response.ok) {
        return obj
    } else {
        throw obj
    }
}

async function GetLocationsList(numLocations = 1, xsrfToken){
    const response = await fetch(
        generateUrl(`${URL_ANALYTICS}/locations`, {numLocations}), {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken}
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
    GetMinMaxJobOfferValue,
    GetAverageJobOfferMonthlyValue,
    GetLocationsList,
}

export default AnalyticsAPI
