import { toDate, generateUid } from "@functions";
import BaseModel from "./BaseModel";

class MarkdownDocument extends BaseModel {
    public name: string;
    public content: string;
    public savedAt?: Date;

    constructor(data: Partial<MarkdownDocument> = {}) {
        const {
            uid = generateUid("mkd-"),
            name = "",
            content = "",
            savedAt,
            ...rest
        } = data;
        super(rest);

        this.uid = uid;
        this.name = name;
        this.content = content;
        if (savedAt) this.savedAt = toDate(savedAt);
    }
}

export default MarkdownDocument;
export { MarkdownDocument };
