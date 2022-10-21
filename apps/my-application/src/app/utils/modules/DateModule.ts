import {DateTime} from "luxon";
import config from "../../config/app";

export class DateModule {

    private readonly DEFAULT_TIME_ZONE: string;

    constructor(timezone:string) {
        this.DEFAULT_TIME_ZONE = timezone
    }

    /**
     *
     * @param value
     * @return {DateTime}
     */
    public parseTime(value: Date | string): DateTime {
        let date: DateTime;

        // Parse based on type
        if (value instanceof Date) {
            date = DateTime.fromJSDate(value);
        } else {
            date = DateTime.fromISO(value);
        }

        // Throw exception when invalid
        if (!date.isValid) {
            throw new Error(`Provided date couldn't be parsed: ${date.invalidExplanation}`);
        }

        // Apply timezone & return
        return date.setZone(this.DEFAULT_TIME_ZONE);
    }

    /**
     *
     * @param value
     * @return {string}
     */
    public getPrettyDate(value: DateTime): string {
        return value.toFormat("yyyy-LL-dd HH:mm:ss");
    }

    /**
     *
     * @param value
     * @param format
     * @return {string}
     */
    public format(value: DateTime, format: string): string {
        return value.toFormat(format);
    }

    /**
     * Base time getter
     *
     * @return {DateTime}
     */
    public getTime(): DateTime {
        return DateTime.utc().setZone(this.DEFAULT_TIME_ZONE);
    }

    /**
     *
     * @param date
     * @return {DateTime}
     */
    public getResetTime(date?: DateTime): DateTime {
        const baseDate = date || DateTime.utc();
        return baseDate.setZone(this.DEFAULT_TIME_ZONE).startOf("day");
    }

    /**
     *
     * @param value
     * @param days
     * @return {DateTime}
     */
    public addDays(value: DateTime, days: number): DateTime {
        // Add days
        value.plus({days})

        // Apply timezone & return
        return value.setZone(this.DEFAULT_TIME_ZONE);
    }

    /**
     *
     * @param value
     * @param hours
     * @return {DateTime}
     */
    public addHours(value: DateTime, hours: number): DateTime {
        // Add hours
        value.plus({hours})

        // Apply timezone & return
        return value.setZone(this.DEFAULT_TIME_ZONE);
    }

    /**
     *
     * @param value
     * @param minutes
     * @return {DateTime}
     */
    public addMinutes(value: DateTime, minutes: number): DateTime {
        // Add minutes
        value.plus({minutes})

        // Apply timezone & return
        return value.setZone(this.DEFAULT_TIME_ZONE);
    }

    /**
     *
     * @param value
     * @param seconds
     * @return {DateTime}
     */
    public addSeconds(value: DateTime, seconds: number): DateTime {
        // Add seconds
        value.plus({seconds})

        // Apply timezone & return
        return value.setZone(this.DEFAULT_TIME_ZONE);
    }

    /**
     *
     * @param value
     * @param days
     * @return {DateTime}
     */
    public subtractDays(value: DateTime, days: number): DateTime {
        // Subtract days
        value.minus({days})

        // Apply timezone & return
        return value.setZone(this.DEFAULT_TIME_ZONE);
    }

    /**
     *
     * @param value
     * @param hours
     * @return {DateTime}
     */
    public subtractHours(value: DateTime, hours: number): DateTime {
        // Subtract hours
        value.minus({hours})

        // Apply timezone & return
        return value.setZone(this.DEFAULT_TIME_ZONE);
    }

    /**
     *
     * @param value
     * @param minutes
     * @return {DateTime}
     */
    public subtractMinutes(value: DateTime, minutes: number): DateTime {
        // Subtract minutes
        value.minus({minutes})

        // Apply timezone & return
        return value.setZone(this.DEFAULT_TIME_ZONE);
    }

    /**
     *
     * @param value
     * @param seconds
     * @return {DateTime}
     */
    public subtractSeconds(value: DateTime, seconds: number): DateTime {
        // Subtract seconds
        value.minus({seconds})

        // Apply timezone & return
        return value.setZone(this.DEFAULT_TIME_ZONE);
    }

    /**
     * Returns an array of timestamps to user for querying data in a range
     * @param diff
     * @param date
     * @return {Date[][]}
     */
    public generateDataQueryTimestamps(diff: number, date: DateTime): any {
        const timestamps: any = [];
            for(let i = diff; i >= 0; i--) {

                const d = date.minus({days: i})
                timestamps.push({
                    date: this.format(d, 'dd-LL-yyyy'),
                    times: [
                        d.startOf('day').toJSDate().toISOString().replace('T', ' '),
                        d.endOf('day').toJSDate().toISOString().replace('T', ' ')
                    ]
                })
            }
            return timestamps;
    }

    /**
     * Returns difference between start and end
     * @param end
     * @param start
     * @returns {Object}
     */
    public getDateWithDiff(end: any, start: any) {
        const date = this.parseTime(end) || this.getTime();
        const before = start ? this.parseTime(start) : date;
        const diff = Math.floor(date.diff(before, ['days']).toObject().days || 0);
        return { date, diff };
    }
}

const dateModule = new DateModule(config.timezone);
export default dateModule;
