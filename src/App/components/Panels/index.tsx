import DocumentList from "App/components/DocumentList";
import Markdown from "App/components/Markdown";
import Preview from "App/components/Preview";
import DocumentActions from "App/components/DocumentActions";

import styles from "./styles.module.scss";

const Panels = () => (
    <div className={styles.Panels}>
        <DocumentList />
        <Markdown />
        <Preview />
        <DocumentActions />
    </div>
);

export default Panels;
