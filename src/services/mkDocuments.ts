import { MK_LIST_KEY } from "@constants";
import MarkdownDocument from "@models/MarkdownDocument";

const mkDocuments = {
    list(): MarkdownDocument[] {
        const dataListOrNull = localStorage.getItem(MK_LIST_KEY);
        if (!dataListOrNull) return [];

        const dataList: any[] = JSON.parse(dataListOrNull);
        return dataList.map((data) => new MarkdownDocument(data));
    },
    save(document: MarkdownDocument): MarkdownDocument {
        const docs = this.list();
        document.savedAt = new Date();

        const isNew = !docs.find((doc) => doc.uid === document.uid);

        if (isNew) {
            document.createdAt = document.savedAt;

            localStorage.setItem(
                MK_LIST_KEY,
                JSON.stringify([...docs, document])
            );
        } else {
            const newDocs = docs.map((doc) => {
                return doc.uid === document.uid
                    ? {
                          ...doc,
                          ...document,
                      }
                    : doc;
            });
            localStorage.setItem(MK_LIST_KEY, JSON.stringify(newDocs));
        }

        return document;
    },
    delete(document: MarkdownDocument): void {
        const list = mkDocuments.list();
        localStorage.setItem(
            MK_LIST_KEY,
            JSON.stringify(list.filter((doc) => doc.uid !== document.uid))
        );
    },
};

export default mkDocuments;
export { mkDocuments };
