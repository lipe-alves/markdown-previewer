import dictionaries from "@dictionaries";

export interface ContextProviderProps {
    children: React.ReactNode;
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
