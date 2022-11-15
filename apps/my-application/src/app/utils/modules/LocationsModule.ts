export interface LocationObject{
    name: string,
    address: {
        postalCode: string,
        city: string,
        street:  string,
        houseNubmer: number,
        houseNubmerAddition: string,
    }
}
export default class LocationsModule {
    public lon: string;
    public lat: string;
    constructor(lon: string, lat: string) {
        this.lon = lon;
        this.lat = lat;
    }

    static async getCoords(locations: LocationObject[]) {
        
    }
}