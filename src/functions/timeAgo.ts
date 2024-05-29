import toDate from "./toDate";

function timeAgo(input: Date | string, locale: string): string | undefined {
    const date = toDate(input);
    const formatter = new Intl.RelativeTimeFormat(locale, {
        style: "long",
    });

    const ranges = {
        years: 3600 * 24 * 365,
        months: 3600 * 24 * 30,
        weeks: 3600 * 24 * 7,
        days: 3600 * 24,
        hours: 3600,
        minutes: 60,
        seconds: 1,
    };

    const secondsElapsed = (date.getTime() - Date.now()) / 1000;

    for (const key in ranges) {
        const rangeName = key as keyof typeof ranges;

        if (ranges[rangeName] < Math.abs(secondsElapsed)) {
            const delta = secondsElapsed / ranges[rangeName];
            return formatter.format(Math.round(delta), rangeName);
        }
    }

    return undefined;
}

export { timeAgo };
export default timeAgo;
