import {generateUrl} from "../utils/urlBuilder.js"

const URL_KAFKA_CONNECTOR = 'http://localhost:8083/connectors'

async function PostKafkaConnector(connector){
    const response = await fetch(
        generateUrl(`${URL_KAFKA_CONNECTOR}`), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'/*, 'X-XSRF-TOKEN': xsrfToken*/},
            body: JSON.stringify(connector)
        }
    )

    const obj = await response.json()

    if (response.ok) {
        return obj
    } else {
        throw obj
    }
}


const AnalyticsAPI = {
    PostKafkaConnector,
}

export default AnalyticsAPI
