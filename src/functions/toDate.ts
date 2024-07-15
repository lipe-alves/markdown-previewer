function toDate(value: any): Date {
    if (value && typeof value === "object" && value.toDate) {
        const date = value.toDate();
        return date;
    }
    if (
        value &&
        typeof value === "object" &&
        value._seconds &&
        value._nanoseconds !== undefined
    ) {
        const date = new Date(
            parseInt(
                value._seconds +
                    "" +
                    ("000" + value._nanoseconds).slice(-3).substr(0, 3)
            )
        );
        return date;
    }
    if (
        value &&
        typeof value === "object" &&
        value.seconds &&
        value.nanoseconds !== undefined
    ) {
        const date = new Date(
            parseInt(
                value.seconds +
                    "" +
                    ("000" + value.nanoseconds).slice(-3).substr(0, 3)
            )
        );
        return date;
    }
    if (value instanceof Date) {
        return value;
    }
    if (typeof value === "string" && value !== "") {
        if (value.match(/\d{2}\/\d{2}\/\d+/)) {
            const [day, month, yearAndTime] = value.split("/");
            value = `${month}/${day}/${yearAndTime}`;
        }

        return new Date(value);
    }
    return value;
}

export default toDate;
export { toDate };
