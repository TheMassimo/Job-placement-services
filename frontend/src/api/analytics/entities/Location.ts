
export interface LocationRawData {
    locationId: number | null
    location: string
    professionals: number
}

export class Location implements LocationRawData {
    locationId: number | null
    location: string
    professionals: number

    constructor(locationId: number | null,
        location: string,
        professionals: number,
    ) {
        this.locationId = locationId
        this.location = location
        this.professionals = professionals
    }

    static fromJsonObject(obj: LocationRawData): Location | null {
        try {
            return new Location(
                obj.locationId,
                obj.location,
                obj.professionals)
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
