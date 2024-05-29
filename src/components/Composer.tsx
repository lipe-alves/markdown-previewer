import React, { ReactNode } from "react";

interface ComposerProps {
    components: Array<(props: any) => JSX.Element>;
    children?: ReactNode;
}

const Composer = (props: ComposerProps) => (
    <>
        {props.components.reduceRight(
            (otherComponents, Component) => (
                <Component>{otherComponents}</Component>
            ),
            props.children
        )}
    </>
);

export { Composer };
export type { ComposerProps };
export default Composer;
