interface ToolPanelParams {
    scale: number;
    rotate: number;
}
interface CustomFiles {
    url: string;
    originName: string;
}
type ConstructorParams = {
    files: CustomFiles[];
    showUrl: string;
};
declare class FileView {
    fileViewDescElement: HTMLElement | null;
    toolPanelParams: ToolPanelParams;
    needTools: boolean;
    private loadingInstance;
    maskElement: HTMLElement | null;
    showElement: HTMLElement | null;
    maskEnableClick: boolean;
    private currentIndex;
    private files;
    constructor({ files, showUrl }: ConstructorParams);
    initMask(): void;
    initTools(): void;
    addCLoseIcon(): void;
    initArrow(): void;
    loadImage(url: string): void;
    handleImgLoadError(): void;
    loadPDF(fileId: string): void;
    clearShowContent(): void;
    getFileType(originName: string): string;
    showFile(item: CustomFiles): void;
    open(): void;
    close(): void;
    jumpSwitch(pageIndex: number): void;
    showLoading(): void;
    closeLoading(): void;
    previewPDF(fileId: string): Promise<void>;
    getBlobFile(fileId: string): Promise<void>;
    initToolPanelParams(): void;
    handleImg(): void;
    handleTool(type: string): void;
    arrowIsActive(): void;
    initFileName(): void;
    setFilePageName(): void;
}
export default FileView;
