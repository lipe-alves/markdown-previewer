function toNumber(value: string): number {
    return Number(value.replace(/\D/g, "").replace(/,/g, "."));
}

export default toNumber;
export { toNumber };
