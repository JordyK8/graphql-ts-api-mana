import NodeGeocoder, { Geocoder } from "node-geocoder";
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
    public geocoder: Geocoder;
    constructor(lon: string, lat: string) {
        this.geocoder = NodeGeocoder({
            provider: 'google',
            // Optional depending on the providers
            // fetch: customFetchImplementation,
            apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, Google Premier
            formatter: null // 'gpx', 'string', ...
        })
        this.lon = lon;
        this.lat = lat;
    }

    static async getCoords(locations: LocationObject[]) {
        const res = await NodeGeocoder({
            provider: 'google',
            // Optional depending on the providers
            // fetch: customFetchImplementation,
            apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, Google Premier
            formatter: null // 'gpx', 'string', ...
        }).geocode()
    }
}