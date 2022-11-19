import { Client, GeocodeRequest } from "@googlemaps/google-maps-services-js";
export interface LocationObject{
    name: string,
    address: {
        postalCode: string,
        city: string,
        street:  string,
        houseNumber: number,
        houseNumberAddition: string,
    }
}
export default class LocationsModule {
    public client: Client;
    private args: GeocodeRequest;
    constructor(lon: string, lat: string) {
        this.client = new Client({})
        this.args = {
            params: {
                key: '<your-api-key>',
                address: '',
            }
        }
    }

    async getCoords(location: LocationObject) {
            this.args.params.address = `
                ${location.address.street} 
                ${location.address.houseNumber} 
                ${location.address.houseNumberAddition} 
                ${location.address.postalCode} 
                ${location.address.city}
            `;
            this.client.geocode(this.args).then(gcResponse => {
                const str = JSON.stringify(gcResponse.data.results[0]);
                const str2 = JSON.stringify(gcResponse.data.results[1]);
                console.log(`First result is: ${str}`);
                console.log(`Second result is: ${str2}`);
            });
         
    }
}