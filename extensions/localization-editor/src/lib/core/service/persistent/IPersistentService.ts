/* eslint-disable semi */
export default interface IPersistentService<T> {
    initDataSource(): void
    read(): void
    persistent(): void
    uninstall(): void
}
