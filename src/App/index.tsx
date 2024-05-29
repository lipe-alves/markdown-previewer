import { useEffect } from "react";

import { useModal, useLoader } from "@providers";
import { Modal, Spinner } from "@components";
import { AppProvider } from "./providers";

import Topbar from "./components/Topbar";
import Panels from "./components/Panels";

import styles from "./styles.module.scss";

function App() {
    const { modalProps } = useModal();
    const loader = useLoader();

    return (
        <AppProvider>
            <div className={styles.App}>
                <Topbar />
                <Panels />
                <Spinner
                    open={loader.visible}
                    onClose={loader.hide}
                />
                <Modal {...modalProps} />
            </div>
        </AppProvider>
    );
}

export default App;
