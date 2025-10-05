export enum QrOutputFormatEnum {
    SVG = 'svg',
    PNG_DATA_URL = 'png-data-url',
    PNG_BUFFER = 'png-buffer',
}

/**
 * Error correction level (default: 'M')
 * L - Low (7% of data can be restored)
 * M - Medium (15% of data can be restored)
 * Q - Quartile (25% of data can be restored)
 * H - High (30% of data can be restored)
 */
export enum QrErrorCorrectionLevelEnum {
    L = 'L',
    M = 'M',
    Q = 'Q',
    H = 'H',
}
