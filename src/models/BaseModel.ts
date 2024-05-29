import { generateUid, toDate } from "@functions";

class BaseModel {
    public uid: string;
    public createdAt: Date;

    constructor(data: Partial<BaseModel> = {}) {
        const { uid = generateUid(), createdAt = new Date() } = data;
        this.uid = uid;
        this.createdAt = toDate(createdAt);
    }
}

export default BaseModel;
export { BaseModel };
