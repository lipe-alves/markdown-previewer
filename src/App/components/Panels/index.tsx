import DocumentList from "../DocumentList";
import Markdown from "../Markdown";
import Preview from "../Preview";

import styles from "./styles.module.scss";

const Panels = () => (
    <div className={styles.Panels}>
        <DocumentList />
        <Markdown />
        <Preview />
    </div>
);

export default Panels;
