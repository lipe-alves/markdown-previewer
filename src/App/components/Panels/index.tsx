import { useEditor } from "@providers";

import Documents from "../Documents";
import Markdown from "../Markdown";
import Preview from "../Preview";

import styles from "./styles.module.scss";

function Panels() {
    const { drafts } = useEditor();

    return (
        <div className={styles.Panels}>
            {drafts.length > 0 && <Documents />}
            <Markdown />
            <Preview />
        </div>
    );
}

export default Panels;
