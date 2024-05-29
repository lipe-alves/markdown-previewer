function fixTimezone(d: Date): Date {
    let date = new Date(d.getTime());
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

    return date;
}

export default fixTimezone;
export { fixTimezone };
