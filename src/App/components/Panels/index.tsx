import { useEditor } from "@providers";

import DocumentList from "../DocumentList";
import Markdown from "../Markdown";
import Preview from "../Preview";

import styles from "./styles.module.scss";

function Panels() {
    const { drafts } = useEditor();

    return (
        <div className={styles.Panels}>
            {drafts.length > 0 && <DocumentList />}
            <Markdown />
            <Preview />
        </div>
    );
}

export default Panels;
