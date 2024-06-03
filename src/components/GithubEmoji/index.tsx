import emojis from "./emojis";
import styles from "./styles.module.scss";

type EmojiName = keyof typeof emojis;

interface GithubEmojiProps {
    name: EmojiName;
    size?: number;
}

function GithubEmoji(props: GithubEmojiProps) {
    const { name, size } = props;
    return (
        <span
            className={styles.GithubEmoji}
            style={{
                fontSize: size,
            }}
        >
            {emojis[name]}
        </span>
    );
}

export default GithubEmoji;
export { GithubEmoji };
export type { GithubEmojiProps };
